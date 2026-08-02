const form = document.querySelector('#form-demo');
const whatsapp = '5583991744139';

if (form) {
  const setInvalid = (field, invalid) => {
    field.closest('.field')?.classList.toggle('field--invalid', invalid);
    field.setAttribute('aria-invalid', String(invalid));
  };

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => setInvalid(field, false));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach((field) => {
      const empty = field instanceof HTMLInputElement && field.type === 'checkbox'
        ? !field.checked
        : !field.value.trim();
      const invalidEmail = field instanceof HTMLInputElement
        && field.type === 'email'
        && field.value.trim() !== ''
        && !field.checkValidity();
      const invalid = empty || invalidEmail;
      setInvalid(field, invalid);
      if (invalid && !firstInvalid) firstInvalid = field;
    });

    const status = document.querySelector('.form__status');
    if (firstInvalid) {
      firstInvalid.focus();
      if (status) {
        status.className = 'form__status form__status--error';
        status.textContent = 'Revise os campos destacados antes de enviar.';
      }
      return;
    }

    const values = new FormData(form);
    const lines = [
      'Olá! Conheci o Chronos pelo site e gostaria de agendar uma demonstração para minha empresa.',
      '',
      `Nome: ${values.get('nome')}`,
      `Empresa: ${values.get('empresa')}`,
      `WhatsApp: ${values.get('whatsapp')}`,
      `E-mail: ${values.get('email')}`,
      `Colaboradores (aprox.): ${values.get('colaboradores')}`,
      `Filiais: ${values.get('filiais')}`,
    ];
    const message = String(values.get('mensagem') ?? '').trim();
    if (message) lines.push(`Mensagem: ${message}`);

    if (status) {
      status.className = 'form__status form__status--success';
      status.textContent = 'Abrindo o WhatsApp com sua mensagem…';
    }
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
}
