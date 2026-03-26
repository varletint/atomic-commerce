import { env } from "@/config";

class AnalyticsService {
  track(event: string, properties?: Record<string, unknown>) {
    if (!env.isProduction) {
      console.log("Analytics:", event, properties);
      return;
    }

    // Implement your analytics provider (GA, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag("event", event, properties);
    }
  }

  page(path: string) {
    if (!env.isProduction) {
      console.log("Page view:", path);
      return;
    }

    if (window.gtag) {
      window.gtag("config", env.googleAnalyticsId, {
        page_path: path,
      });
    }
  }
}

export const analyticsService = new AnalyticsService();
