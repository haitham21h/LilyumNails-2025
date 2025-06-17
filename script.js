// عناصر النموذج
const knowSizes = document.getElementById('know-sizes');
const sizesSection = document.getElementById('sizes-section');
const fullSizesNote = document.getElementById('full-sizes-note');
const photoInstructions = document.getElementById('photo-instructions');
const shapeInput = document.getElementById('shape');
const sendBtn = document.getElementById('send-btn');

const fingersRight = [
  'الإبهام يمين', 'السبابة يمين', 'الوسطى يمين', 'البنصر يمين', 'الخنصر يمين'
];
const fingersLeft = [
  'الإبهام يسار', 'السبابة يسار', 'الوسطى يسار', 'البنصر يسار', 'الخنصر يسار'
];
const allFingers = [...fingersRight, ...fingersLeft];
const sizeOptions = Array.from({ length: 13 }, (_, i) => `<option style='font-size:1.236rem;padding:0.618rem 1rem;'>${i}</option>`).join('');

// تغيير حقل المقاسات بناءً على الاختيار
knowSizes?.addEventListener('change', () => {
  sizesSection.innerHTML = '';
  fullSizesNote?.classList.add('hidden');

  if (knowSizes.value === 'yes') {
    sizesSection.innerHTML += `<h4 style='font-size:1.618rem;margin:1.618rem 0 1rem 0;'>✋ اليد اليمنى</h4>`;
    fingersRight.forEach(finger => {
      sizesSection.innerHTML += `
        <div class="form-group" style="margin-bottom:1.618rem;">
          <label style="font-size:1.236rem;">${finger}</label>
          <select class="size-select glass-select" style="border-radius:0.618rem;padding:0.618rem 1rem;min-width:90px;">
            ${sizeOptions}
          </select>
        </div>
      `;
    });
    sizesSection.innerHTML += `<h4 style='font-size:1.618rem;margin:1.618rem 0 1rem 0;'>🤚 اليد اليسرى</h4>`;
    fingersLeft.forEach(finger => {
      sizesSection.innerHTML += `
        <div class="form-group" style="margin-bottom:1.618rem;">
          <label style="font-size:1.236rem;">${finger}</label>
          <select class="size-select glass-select" style="border-radius:0.618rem;padding:0.618rem 1rem;min-width:90px;">
            ${sizeOptions}
          </select>
        </div>
      `;
    });
    sizesSection.classList.remove('hidden');
    photoInstructions.classList.remove('hidden');
    photoInstructions.innerHTML = `✅ يرجى تعبئة جميع المقاسات بدقة، وسننفذ التصميم حسب ما تم تحديده.`;
  } else if (knowSizes.value === 'no') {
    sizesSection.classList.add('hidden');
    photoInstructions.classList.remove('hidden');
    photoInstructions.innerHTML = `
      📸 بعد إرسال الطلب، سوف تقومين بإرسال صور يديك عبر الواتساب كما يلي:<br>
      - صورة لأربع أصابع بجانب عملة معدنية لكل يد<br>
      - ثم صورة لكل إبهام على حدة
    `;
  }
});

// التحقق من اكتمال المقاسات
sizesSection?.addEventListener('change', () => {
  if (knowSizes.value === 'yes') {
    const allFilled = [...document.querySelectorAll('.size-select')].every(s => s.value !== '');
    fullSizesNote?.classList.toggle('hidden', !allFilled);
  }
});

// تحديد شكل الأظافر من الصور
const shapeImages = document.querySelectorAll('.shape-picker img');
shapeImages.forEach(img => {
  img.addEventListener('click', () => {
    shapeImages.forEach(i => i.classList.remove('selected'));
    img.classList.add('selected');
    shapeInput.value = img.getAttribute('data-shape');
  });
});

// إرسال الطلب
sendBtn?.addEventListener('click', () => {
  if (sendBtn.disabled) return;
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const shape = shapeInput?.value.trim();
  const knows = knowSizes?.value;
  const note = document.getElementById('design-note')?.value.trim();

  if (!name || !phone || !knows || !shape) {
    alert('يرجى تعبئة جميع الحقول واختيار شكل الأظافر.');
    return;
  }

  let msg = `مرحباً، اسمي ${name} وأرغب بطلب تصميم أظافر مخصص.\n`;
  msg += `رقم الجوال: ${phone}\n`;
  msg += `شكل الأظافر: ${shape}\n`;
  msg += `هل أعرف المقاسات؟: ${knows === 'yes' ? 'نعم' : 'لا'}\n`;

  if (knows === 'yes') {
    msg += `المقاسات:\n`;
    document.querySelectorAll('.size-select').forEach((s, i) => {
      msg += `${allFingers[i]}: ${s.value || '--'}\n`;
    });
    const allFilled = [...document.querySelectorAll('.size-select')].every(s => s.value !== '');
    if (allFilled) msg += `\n📌 سوف أقوم بإرفاق صورة التصميم إن وجدت.`;
  } else {
    msg += `\n📸 سوف أقوم بإرسال صور يدي عبر الواتساب بعد إرسال هذا الطلب.`;
  }

  if (note) {
    msg += `\n📝 وصف التصميم:\n${note}`;
  }

  // تعطيل الزر مؤقتاً
  sendBtn.disabled = true;
  sendBtn.textContent = "يتم الإرسال...";

  // تخزين الرسالة وإعادة التوجيه
  localStorage.setItem("lilyum_msg", msg);
  setTimeout(() => {
    window.location.href = "success.html";
  }, 2000);
});

// صفحة النجاح - إدخال الرسالة
window.addEventListener("DOMContentLoaded", () => {
  const successLink = document.querySelector("#whatsapp-link") || document.querySelector("#whatsapp-success");
  const savedMsg = localStorage.getItem("lilyum_msg");
  if (successLink && savedMsg) {
    // ترميز الرسالة بشكل صحيح مع استبدال \n بـ %0A
    const encoded = encodeURIComponent(savedMsg.replace(/\n/g, '%0A'));
    successLink.href = `https://api.whatsapp.com/send?phone=966549542823&text=${encoded}`;
  }
});
// إعادة تعيين الرسالة عند الخروج من صفحة النجاح
window.addEventListener("beforeunload", () => {
  localStorage.removeItem("lilyum_msg");
}); 