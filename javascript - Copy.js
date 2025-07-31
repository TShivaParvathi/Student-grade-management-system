let displayedNames = new Set();

document.getElementById('gradeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const mark1 = parseInt(document.getElementById('mark1').value);
  const mark2 = parseInt(document.getElementById('mark2').value);
  const mark3 = parseInt(document.getElementById('mark3').value);

  if (!name) return;

  let students = JSON.parse(localStorage.getItem('students')) || [];

  const existsInStorage = students.some(s => s.name.toLowerCase() === name.toLowerCase());
  if (existsInStorage) {
    alert("Student with this name already exists in records!");
    return;
  }

  const marks = [mark1, mark2, mark3];
  const avg = (mark1 + mark2 + mark3) / 3;
  let grade = '';

  if (avg >= 90) grade = 'A';
  else if (avg >= 80) grade = 'B';
  else if (avg >= 70) grade = 'C';
  else if (avg >= 60) grade = 'D';
  else grade = 'F';

  const student = {
    name,
    marks,
    average: avg.toFixed(2),
    grade
  };

  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));

  addStudentToTable(student, "Manual");
  document.getElementById('gradeForm').reset();
});

function addStudentToTable(student, source) {
  if (displayedNames.has(student.name.toLowerCase())) return;

  const table = document.getElementById('studentTable');
  const row = table.insertRow();

  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.marks.join(', ')}</td>
    <td>${student.average}</td>
    <td>${student.grade}</td>
    <td>${source}</td>
  `;

  displayedNames.add(student.name.toLowerCase());
}

function loadStudents() {
  const storedData = JSON.parse(localStorage.getItem('students')) || [];

  if (storedData.length === 0) {
    alert("No student data found.");
    return;
  }

  storedData.forEach(student => {
    addStudentToTable(student, "Fetched");
  });
}

function clearAll() {
  if (confirm("Are you sure you want to delete all records?")) {
    localStorage.removeItem('students');
    document.getElementById('studentTable').innerHTML = '';
    displayedNames.clear();
  }
}

function searchStudents() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#studentTable tr');

  rows.forEach(row => {
    const nameCell = row.querySelector('td');
    if (!nameCell) return;

    const name = nameCell.textContent.toLowerCase();
    row.style.display = name.includes(filter) ? '' : 'none';
  });
}
