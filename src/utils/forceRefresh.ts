// Force refresh utility to clear any rendering issues
export function forceRefresh() {
  // Force a complete re-render by updating the key
  window.location.reload();
}

// Auto-refresh on mount if needed (development helper)
export function autoRefreshOnMount() {
  const hasRefreshed = sessionStorage.getItem('has-refreshed');
  if (!hasRefreshed) {
    sessionStorage.setItem('has-refreshed', 'true');
    window.location.reload();
  }
}

// Clear the refresh flag
export function clearRefreshFlag() {
  sessionStorage.removeItem('has-refreshed');
}