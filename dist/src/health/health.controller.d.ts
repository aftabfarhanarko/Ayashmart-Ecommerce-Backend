export declare class HealthController {
    get(): {
        status: string;
        env: string;
        uptime: number;
        timestamp: number;
    };
}
