#!/bin/bash

# Configuration
API_URL="http://localhost:8000"
COMPANY_ID="67909062-8173-4560-8025-06ec1328994a" # Using a sample UUID, replace if needed

echo "---------------------------------------------------"
echo "Test 1: Public Order Creation (Guest Checkout)"
echo "---------------------------------------------------"
# Create an order without JWT, only using companyId query param
RESPONSE=$(curl -s -X POST "$API_URL/orders?companyId=$COMPANY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Guest User",
    "customerPhone": "01700000000",
    "customerAddress": "123 Guest St, Dhaka",
    "items": [
      {
        "productId": 34, 
        "quantity": 1
      }
    ],
    "paymentMethod": "COD",
    "deliveryType": "INSIDEDHAKA"
  }')

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "Order created"; then
  echo "✅ Public Order Creation: PASSED"
  # Extract Order ID and Tracking ID from the response for further testing
  # Note: The response structure is { statusCode: 201, message: "Order created", data: { order: { ... } } }
  ORDER_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  # Tracking ID might not be generated immediately on create if it's pending, 
  # but let's see if we can get it from the response data if available.
  # If not, we might need a separate way to get it or just test tracking with a known ID if this fails.
else
  echo "❌ Public Order Creation: FAILED"
  exit 1
fi

echo ""
echo "---------------------------------------------------"
echo "Test 2: Private Access Check (findAll)"
echo "---------------------------------------------------"
# Try to access findAll without token
FAIL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/orders?companyId=$COMPANY_ID")

if [ "$FAIL_RESPONSE" == "401" ]; then
  echo "✅ Private Access Check (findAll): PASSED (Received 401 Unauthorized)"
else
  echo "❌ Private Access Check (findAll): FAILED (Expected 401, got $FAIL_RESPONSE)"
fi

echo ""
echo "---------------------------------------------------"
echo "Test 3: Private Access Check (findOne)"
echo "---------------------------------------------------"
# Try to access findOne without token
if [ -n "$ORDER_ID" ]; then
    FAIL_RESPONSE_ONE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/orders/$ORDER_ID?companyId=$COMPANY_ID")

    if [ "$FAIL_RESPONSE_ONE" == "401" ]; then
      echo "✅ Private Access Check (findOne): PASSED (Received 401 Unauthorized)"
    else
      echo "❌ Private Access Check (findOne): FAILED (Expected 401, got $FAIL_RESPONSE_ONE)"
    fi
else
    echo "⚠️ Skipping Test 3 (No Order ID from Test 1)"
fi

echo ""
echo "---------------------------------------------------"
echo "Test 4: Public Tracking Check"
echo "---------------------------------------------------"

# We need a valid tracking ID. 
# Since we just created an order, it might not have a tracking ID yet (depends on business logic, usually assigned on processing).
# However, `TrackOrderController` uses `shippingTrackingId`.
# If the order created above doesn't have one, we can try to hit the endpoint with a dummy ID to ensuring it reaches the controller (even if 404).

TRACK_RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/orders/track/SC-TEST-12345")

# We expect 404 (Not Found) effectively meaning code execution reached the service, 
# NOT 401 (Unauthorized).
if [ "$TRACK_RESPONSE_CODE" != "401" ]; then
  echo "✅ Public Tracking Check: PASSED (Access granted, code: $TRACK_RESPONSE_CODE)"
else
  echo "❌ Public Tracking Check: FAILED (Received 401 Unauthorized)"
fi

echo "---------------------------------------------------"
echo "Tests Completed"
