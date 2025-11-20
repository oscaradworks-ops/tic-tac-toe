// Simple client-side contact form handling
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showResult(message, ok = true){
  formResult.textContent = message;
  formResult.style.color = ok ? 'var(--accent)' : 'var(--danger)';
}

function handleSubmit(e){
  e.preventDefault();
  if(!contactForm) return;
  const data = new FormData(contactForm);
  const name = (data.get('name')||'').toString().trim();
  const email = (data.get('email')||'').toString().trim();
  const phone = (data.get('phone')||'').toString().trim();
  const message = (data.get('message')||'').toString().trim();

  if(!name){ showResult('Please enter your name.', false); return; }
  if(!validateEmail(email)){ showResult('Please enter a valid email address.', false); return; }
  if(!message){ showResult('Please enter a message.', false); return; }

  // Simulate successful submit (client-side only)
  showResult('Message sent — thank you!', true);
  contactForm.reset();

  // optional: remove message after a short delay
  setTimeout(()=>{ if(formResult) formResult.textContent = ''; }, 4500);
}

if(contactForm){
  contactForm.addEventListener('submit', handleSubmit);
}

export {};
