// Paste your deployed Apps Script web app URL here (see setup in project chat / docs).
window.AAContactSheet = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbz9xSNF4vPW5aqZl-IIERZqqwhDQY4BCKPUwhm_Ot9T8mfBIdGf12HfbDEj_Z3qSoE2/exec',
  SEGMENT_LABELS: {
    gov: 'Government',
    ent: 'Enterprise',
    sme: 'SME / family',
    fin: 'Financial services',
  },

  TIMELINE_LABELS: {
    urgent: 'Within 2 weeks',
    '6-weeks': '6 weeks',
    quarter: 'This quarter',
    flex: 'Flexible',
  },

  async submit(form) {
    const url = window.AAContactSheet.SCRIPT_URL;
    if (!url) {
      throw new Error('Contact sheet URL is not configured.');
    }

    const payload = {
      service: form.service,
      segment: window.AAContactSheet.SEGMENT_LABELS[form.segment] || form.segment,
      context: form.context,
      timeline: window.AAContactSheet.TIMELINE_LABELS[form.timeline] || form.timeline,
      entity: form.entity,
      email: form.email,
      consent: form.consent ? 'Yes' : 'No',
      marketingOptIn: form.marketing ? 'Yes' : 'No',
      consentAt: new Date().toISOString(),
    };

    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  },

  // Post an arbitrary payload (e.g. the e-invoicing readiness assessment) to the
  // same endpoint. The Apps Script writes a row to the sheet and emails the firm.
  async submitRaw(payload) {
    const url = window.AAContactSheet.SCRIPT_URL;
    if (!url) {
      throw new Error('Contact sheet URL is not configured.');
    }
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  },
};
