import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cheerio from "cheerio";
import { OrderService } from "../orders/orders.service";

/** Unified tracking item - same format as RedX/Steadfast/Pathao */
export interface TrackingItem {
  messageEn: string;
  messageBn: string;
  status: string;
  groupedStatus: string;
  action: string;
  time: string;
  reason?: string;
  /** Previous status (internal status history) */
  previousStatus?: string;
}

export interface UnifiedTrackingResponse {
  isError: boolean;
  courier: string;
  tracking_id: string;
  status: string;
  tracking: TrackingItem[];
  raw?: Record<string, unknown>;
}

@Injectable()
export class TrackingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
  ) {}

  /** Common courier status/message → Bangla translation */
  private static readonly STATUS_BN: Record<string, string> = {
    "in transit": "পথ অতিক্রমণ করছে",
    "in-transit": "পথ অতিক্রমণ করছে",
    "delivered": "ডেলিভারি সম্পন্ন",
    "out for delivery": "ডেলিভারির জন্য বের হয়েছে",
    "out-for-delivery": "ডেলিভারির জন্য বের হয়েছে",
    "picked up": "কুরিয়ার দ্বারা সংগ্রহ করা হয়েছে",
    "picked-up": "কুরিয়ার দ্বারা সংগ্রহ করা হয়েছে",
    "received": "প্রাপ্ত",
    "processing": "প্রক্রিয়াধীন",
    "pending": "অপেক্ষমাণ",
    "paid": "পেইড",
    "shipped": "পাঠানো হয়েছে",
    "cancelled": "বাতিল",
    "refunded": "রিফান্ড",
    "returned": "ফেরত",
    "not found": "পাওয়া যায়নি",
    "error": "ত্রুটি",
  };

  private translateToBangla(msg: string): string {
    const key = (msg || "").toLowerCase().trim();
    return TrackingService.STATUS_BN[key] ?? msg;
  }

  /** Normalize courier tracking array to unified format */
  private toTrackingItems(
    items: Array<{
      messageEn?: string;
      message_en?: string;
      messageBn?: string;
      message_bn?: string;
      message?: string;
      status?: string;
      groupedStatus?: string;
      action?: string;
      time?: string;
      reason?: string;
    }>,
  ): TrackingItem[] {
    return items.map((h) => {
      const msgEn = h.messageEn ?? h.message_en ?? h.message ?? "";
      const msgBnRaw = h.messageBn ?? h.message_bn ?? h.message ?? "";
      const msgBn = msgBnRaw && msgBnRaw !== msgEn ? msgBnRaw : this.translateToBangla(msgEn || msgBnRaw);
      return {
        messageEn: msgEn,
        messageBn: msgBn,
        status: h.status ?? "unknown",
        groupedStatus: h.groupedStatus ?? h.status ?? "unknown",
        action: h.action ?? h.status ?? "unknown",
        time: h.time ?? new Date().toISOString(),
        reason: h.reason,
      };
    });
  }

  /**
   * RedX: GET https://api.redx.com.bd/v1/logistics/global-tracking/{id}
   * Response may have: data.tracking or data.tracking_history
   */
  private async trackRedX(trackingId: string): Promise<UnifiedTrackingResponse | null> {
    try {
      const res = await fetch(
        `https://api.redx.com.bd/v1/logistics/global-tracking/${encodeURIComponent(trackingId)}`,
      );
      if (!res.ok) return null;
      const json = await res.json();
      const data = json?.data ?? json;
      if (!data) return null;
      if (json?.isError === true) return null;

      const rawTracking = json?.tracking ?? data?.tracking ?? data?.tracking_history ?? data?.history ?? data?.events ?? [];
      const tracking = this.toTrackingItems(rawTracking);
      const latest = tracking[0];
      const status = latest?.status ?? data?.status ?? data?.current_status ?? "unknown";

      return {
        isError: false,
        courier: "RedX",
        tracking_id: trackingId,
        status: String(status).replace(/-/g, " "),
        tracking,
        raw: data,
      };
    } catch {
      return null;
    }
  }

  /**
   * Steadfast: Scrape https://www.steadfast.com.bd/track/consignment/{id}
   * API may return JSON (consignment not found) or HTML (tracking page)
   */
  private async trackSteadfast(trackingId: string): Promise<UnifiedTrackingResponse | null> {
    try {
      const res = await fetch(
        `https://www.steadfast.com.bd/track/consignment/${encodeURIComponent(trackingId)}`,
      );
      const text = await res.text();

      // Steadfast returns JSON when consignment not found: {"status":0,"message":"Consignment not found!","result":[],"trackings":[]}
      try {
        const json = JSON.parse(text) as { status?: number; message?: string; result?: unknown[]; trackings?: unknown[] };
        if (json.status === 0 || (json.message && /consignment not found/i.test(json.message))) return null;
        if (Array.isArray(json.result) && json.result.length === 0 && Array.isArray(json.trackings) && json.trackings.length === 0) return null;
      } catch {
        // Not JSON, treat as HTML
      }

      const html = text;
      if (!html.includes("Consignment") && !html.includes("consignment")) return null;

      const $ = cheerio.load(html);
      let status = "In Transit";
      const tracking: TrackingItem[] = [];

      // Try table-based layout
      const rows = $("table tr");
      if (rows.length >= 2) {
        const statusCell = rows.eq(1).find("td").eq(2);
        if (statusCell.length) status = statusCell.text().trim() || status;
      }

      // Extract tracking history from table
      $("table tr").each((_, el) => {
        const tds = $(el).find("td");
        if (tds.length >= 2) {
          const msg = tds.eq(1).text().trim();
          const time = tds.eq(2)?.text()?.trim() ?? new Date().toISOString();
          if (msg) {
            tracking.push({
              messageEn: msg,
              messageBn: this.translateToBangla(msg),
              status: status,
              groupedStatus: status,
              action: status,
              time,
            });
          }
        }
      });

      if (tracking.length === 0) {
        tracking.push({
          messageEn: status,
          messageBn: this.translateToBangla(status),
          status,
          groupedStatus: status,
          action: status,
          time: new Date().toISOString(),
        });
      }

      return {
        isError: false,
        courier: "Steadfast",
        tracking_id: trackingId,
        status: status || "In Transit",
        tracking,
        raw: { html: text.slice(0, 500) },
      };
    } catch {
      return null;
    }
  }

  /**
   * Pathao: POST https://merchant.pathao.com/api/v1/user/tracking
   * Body: { tracking_id }
   * Header: Authorization: Bearer {token}
   */
  private async trackPathao(trackingId: string): Promise<UnifiedTrackingResponse | null> {
    const token =
      this.configService.get<string>("PATHAO_TOKEN") ||
      this.configService.get<string>("PATHAO_ACCESS_TOKEN");
    if (!token) return null;

    try {
      const res = await fetch("https://merchant.pathao.com/api/v1/user/tracking", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ tracking_id: trackingId }),
      });

      if (!res.ok) return null;
      const data = await res.json();

      const rawTracking = data?.data?.tracking ?? data?.tracking ?? data?.tracking_history ?? data?.history ?? [];
      const tracking = this.toTrackingItems(rawTracking);
      const latest = tracking[0];
      const status = latest?.status ?? data?.data?.status ?? data?.status ?? "unknown";

      return {
        isError: false,
        courier: "Pathao",
        tracking_id: trackingId,
        status: String(status).replace(/-/g, " "),
        tracking: tracking.length ? tracking : [{ messageEn: status, messageBn: status, status, groupedStatus: status, action: status, time: new Date().toISOString() }],
        raw: (data ?? {}) as Record<string, unknown>,
      };
    } catch {
      return null;
    }
  }

  /** Internal order status → unified tracking format (uses full status history) */
  private orderStatusToTracking(data: {
    status: string;
    message: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    statusHistory?: Array<{ previousStatus?: string; newStatus: string; createdAt: Date | string; comment?: string }>;
    items?: Array<{ name: string; quantity: number }>;
  }): TrackingItem[] {
    const statusMessages: Record<string, { en: string; bn: string }> = {
      pending: { en: "Order received and awaiting confirmation", bn: "অর্ডার প্রাপ্ত এবং নিশ্চিতকরণের অপেক্ষায়" },
      processing: { en: "Order is being prepared for shipment", bn: "অর্ডার শিপমেন্টের জন্য প্রস্তুত করা হচ্ছে" },
      paid: { en: "Payment received. Order is being processed", bn: "পেমেন্ট প্রাপ্ত। অর্ডার প্রক্রিয়াধীন" },
      shipped: { en: "Order has been shipped and is on its way", bn: "অর্ডার পাঠানো হয়েছে এবং পথে আছে" },
      delivered: { en: "Order has been delivered successfully", bn: "অর্ডার সফলভাবে ডেলিভারি হয়েছে" },
      cancelled: { en: "This order has been cancelled", bn: "এই অর্ডার বাতিল করা হয়েছে" },
      refunded: { en: "This order has been refunded", bn: "এই অর্ডার রিফান্ড করা হয়েছে" },
    };

    const tracking: TrackingItem[] = [];

    if (data.statusHistory?.length) {
      for (const h of data.statusHistory) {
        const s = (h.newStatus || "").toLowerCase();
        const msg = statusMessages[s] ?? { en: h.newStatus, bn: h.newStatus };
        const messageEn = msg.en;
        const messageBn = msg.bn;
        const time = h.createdAt ? new Date(h.createdAt).toISOString() : new Date().toISOString();
        tracking.push({
          messageEn,
          messageBn,
          status: h.newStatus,
          groupedStatus: h.newStatus,
          action: h.newStatus,
          time,
          reason: h.comment,
          previousStatus: h.previousStatus,
        });
      }
    } else {
      const s = (data.status || "").toLowerCase();
      const msg = statusMessages[s] ?? { en: data.message, bn: data.message };
      const time = data.updatedAt ? new Date(data.updatedAt).toISOString() : (data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString());
      tracking.push({
        messageEn: msg.en,
        messageBn: msg.bn,
        status: data.status,
        groupedStatus: data.status,
        action: data.status,
        time,
      });
    }

    if (data.items?.length) {
      const itemsMsg = data.items.map((it) => `${it.name} x ${it.quantity}`).join(", ");
      const itemsTime = data.updatedAt ? new Date(data.updatedAt).toISOString() : (data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString());
      tracking.push({
        messageEn: `Items: ${itemsMsg}`,
        messageBn: `আইটেম: ${itemsMsg}`,
        status: data.status,
        groupedStatus: data.status,
        action: "items",
        time: itemsTime,
      });
    }

    return tracking;
  }

  /**
   * Our own order tracking (internal orders database)
   */
  private async trackOurOwn(trackingId: string): Promise<UnifiedTrackingResponse | null> {
    try {
      const data = await this.orderService.findByTrackingId(trackingId);
      if (!data) return null;

      const tracking = this.orderStatusToTracking({
        status: data.status,
        message: data.message,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        statusHistory: data.statusHistory,
        items: data.items,
      });

      return {
        isError: false,
        courier: "Store",
        tracking_id: data.trackingId || trackingId,
        status: data.status || "Unknown",
        tracking,
        raw: data as unknown as Record<string, unknown>,
      };
    } catch {
      return null;
    }
  }

  /**
   * Unified tracking: RedX → Steadfast → Pathao → Own Store
   */
  async trackAnywhere(trackingId: string): Promise<UnifiedTrackingResponse> {
    const trimmed = (trackingId || "").trim();
    if (!trimmed) {
      return {
        isError: true,
        courier: "Unknown",
        tracking_id: "",
        status: "Error",
        tracking: [
          {
            messageEn: "Tracking number is required",
            messageBn: "ট্র্যাকিং নম্বর প্রয়োজন",
            status: "error",
            groupedStatus: "error",
            action: "error",
            time: new Date().toISOString(),
          },
        ],
      };
    }

    const result =
      (await this.trackRedX(trimmed)) ||
      (await this.trackSteadfast(trimmed)) ||
      (await this.trackPathao(trimmed)) ||
      (await this.trackOurOwn(trimmed));

    if (result) return result;

    return {
      isError: true,
      courier: "Unknown",
      tracking_id: trimmed,
      status: "Not Found",
      tracking: [
        {
          messageEn: "Tracking ID not found in any courier",
          messageBn: "কোন কুরিয়ারে ট্র্যাকিং আইডি পাওয়া যায়নি",
          status: "not-found",
          groupedStatus: "not-found",
          action: "not-found",
          time: new Date().toISOString(),
        },
      ],
    };
  }
}
