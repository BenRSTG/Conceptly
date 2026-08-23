"use client";

const SESSION_KEY = "conceptly-session-id";
const UTM_KEY = "conceptly-utm";

export function getOrCreateSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

export function captureUtmFromLocation() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };
    if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
      // Erster Touchpoint gewinnt für die Dauer der Session.
      if (!localStorage.getItem(UTM_KEY)) {
        localStorage.setItem(UTM_KEY, JSON.stringify(utm));
      }
    }
  } catch {
    // Storage nicht verfügbar — Traffic-Quelle bleibt für diese Session unbekannt.
  }
}

export function getStoredUtm(): Record<string, string | null> {
  try {
    const raw = localStorage.getItem(UTM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
