export const triggerGoogleAdsConversion = (conversionId, conversionLabel, value = 1.0, currency = "USD") => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Google Ads conversion skipped in development mode.");
      return;
    }
    if (!window.gtag) {
      console.warn("Google Tag is not loaded yet.");
      return;
    }
    window.gtag("event", "conversion", {
      send_to: `AW-${conversionId}/${conversionLabel}`,
      value,
      currency,
    });
    console.log("Google Ads conversion triggered:", conversionId, conversionLabel);
  };
  