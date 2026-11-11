class Student {
  #grades;
  #attendance;

  constructor(name, grade1, grade2, grade3, attendance) {
    if (!name || name.trim() === "") {
      throw new Error("⚠️ من فضلك أدخل اسم الطالب");
    }
    this.name = name.trim();
    this.grades = [grade1, grade2, grade3];
    this.attendance = attendance;
  }

  set grades(values) {
    values.forEach((g, i) => {
      if (g === "" || g === null || g === undefined || isNaN(g)) {
        throw new Error(`⚠️ درجة المادة ${i + 1} فارغة أو غير صحيحة`);
      }
      if (Number(g) < 0 || Number(g) > 100) {
        throw new Error(`⚠️ درجة المادة ${i + 1} يجب أن تكون بين 0 و 100`);
      }
    });
    this.#grades = values.map(Number);
  }
  get grades() { return this.#grades; }

  set attendance(value) {
    if (value === "" || value === null || value === undefined || isNaN(value)) {
      throw new Error("⚠️ نسبة الحضور فارغة أو غير صحيحة");
    }
    if (Number(value) < 0 || Number(value) > 100) {
      throw new Error("⚠️ نسبة الحضور يجب أن تكون بين 0 و 100");
    }
    this.#attendance = Number(value);
  }
  get attendance() { return this.#attendance; }

  getAverage() {
    const sum = this.#grades.reduce((acc, g) => acc + g, 0);
    return sum / this.#grades.length;
  }
}

let studentsList = [];

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsListDiv = document.getElementById("studentsListDiv");
const reportDiv = document.getElementById("reportDiv");

addBtn.onclick = function () {
  try {
    errorBox.classList.add("d-none");
    errorBox.textContent = "";

    const newStudent = new Student(
      nameInput.value,
      grade1Input.value,
      grade2Input.value,
      grade3Input.value,
      attendanceInput.value
    );

    studentsList.push(newStudent);
    displayStudents();

    nameInput.value = "";
    grade1Input.value = "";
    grade2Input.value = "";
    grade3Input.value = "";
    attendanceInput.value = "";
    nameInput.focus();

  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.classList.remove("d-none");
  }
};

function displayStudents() {
  if (studentsList.length === 0) {
    studentsListDiv.innerHTML = `<p class="text-muted m-0">لم يتم إضافة أي طالب بعد.</p>`;
    return;
  }
  studentsListDiv.innerHTML = studentsList.map((s, index) => `
    <div class="d-flex justify-content-between border-bottom py-2">
      <span><strong>${index + 1}. ${s.name}</strong></span>
      <span>المتوسط: ${s.getAverage().toFixed(2)} | الحضور: ${s.attendance}%</span>
    </div>
  `).join("");
}

mercyBtn.onclick = function () {
  const struggling = studentsList.filter(s => {
    const avg = s.getAverage();
    return avg >= 40 && avg <= 49;
  });

  if (struggling.length === 0) {
    reportDiv.innerHTML = `<div class="alert alert-info m-0">لا يوجد طلاب متعثرون (متوسط من 40 إلى 49).</div>`;
    return;
  }

  const newAverages = struggling.map(s => s.getAverage() + 5);
  const total = newAverages.reduce((acc, avg) => acc + avg, 0);
  const generalAverage = struggling.length > 0 ? total / struggling.length : 0;

  reportDiv.innerHTML = `
    <div class="alert alert-success">
      <h5>✅ تقرير لجنة الرأفة</h5>
      <p><strong>عدد الطلاب المتعثرين:</strong> ${struggling.length}</p>
      <p><strong>أسماؤهم:</strong> ${struggling.map(s => s.name).join(" - ")}</p>
      <p><strong>المتوسط العام بعد الرأفة:</strong> ${generalAverage.toFixed(2)}</p>
    </div>
    ${struggling.map((s, i) => `
      <div class="border rounded p-2 mb-2">
        <strong>${s.name}</strong> - قبل: ${s.getAverage().toFixed(2)} | بعد الرأفة: ${newAverages[i].toFixed(2)}
      </div>
    `).join("")}
  `;
};
