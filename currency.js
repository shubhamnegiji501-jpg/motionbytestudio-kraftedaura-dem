/* Preview currency switch. CAD conversion uses an indicative daily reference rate. */
(() => {
  const STORAGE_KEY = 'ka-currency';
  const CAD_PER_INR = 0.0149;
  const readChoice = () => {
    try { return localStorage.getItem(STORAGE_KEY) === 'CAD' ? 'CAD' : 'INR'; }
    catch { return 'INR'; }
  };
  let currency = readChoice();
  const format = amount => {
    const numeric = Number(amount) || 0;
    const converted = currency === 'CAD' ? numeric * CAD_PER_INR : numeric;
    if (currency === 'CAD') return `CA$${converted.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(converted);
  };
  const refresh = () => {
    document.querySelectorAll('[data-inr-amount]').forEach(node => {
      node.textContent = format(node.dataset.inrAmount);
    });
    document.querySelectorAll('[data-currency-code]').forEach(node => {
      node.textContent = currency;
    });
    document.querySelectorAll('[data-currency-switch]').forEach(select => {
      select.value = currency;
    });
  };
  const set = next => {
    currency = next === 'CAD' ? 'CAD' : 'INR';
    try { localStorage.setItem(STORAGE_KEY, currency); } catch {}
    refresh();
    document.dispatchEvent(new CustomEvent('currencychange', { detail: { currency } }));
  };
  document.querySelectorAll('[data-currency-switch]').forEach(select => {
    select.addEventListener('change', () => set(select.value));
  });
  window.KraftCurrency = {
    get current() { return currency; },
    format,
    markup: amount => `<span data-inr-amount="${Number(amount) || 0}">${format(amount)}</span>`,
    refresh
  };
  refresh();
})();
