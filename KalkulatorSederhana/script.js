const angka1Input = document.getElementById("angka1");
const angka2Input = document.getElementById("angka2");
const tambahBtn = document.getElementById("tambah");
const kurangBtn = document.getElementById("kurang");
const kaliBtn = document.getElementById("kali");
const bagiBtn = document.getElementById("bagi");
const hasilElement = document.getElementById("hasil");
const resultContainer = document.querySelector(".result-container");

function validateInput(nilai1, nilai2) {
  if (nilai1 === "" || nilai2 === "") {
    return "Mohon Masukan Kedua Angka";
  }

  if (isNaN(nilai1) || isNaN(nilai2)) {
    return "Mohon Masukan Angka yang valid";
  }
  return null;
}

function tampilkanHasil(hasil, isError = false) {
  hasilElement.textContent = hasil;
  resultContainer.classList.remove("error", "success");

  if (isError) {
    resultContainer.classList.add("error");
  } else {
    resultContainer.classList.add("success");
  }
}

function hitung(operasi) {
  const nilai1 = angka1Input.value.trim();
  const nilai2 = angka2Input.value.trim();
  const error = validateInput(nilai1, nilai2);

  if (error) {
    tampilkanHasil(error, true);
    return;
  }

  const angka1 = parseFloat(nilai1);
  const angka2 = parseFloat(nilai2);

  let hasil;
  let operasiText;

  switch (operasi) {
    case "tambah":
      hasil = angka1 + angka2;
      operasiText = "+";
      break;
    case "kurang":
      hasil = angka1 - angka2;
      operasiText = "-";
      break;
    case "kali":
      hasil = angka1 * angka2;
      operasiText = "*";
      break;
    case "bagi":
      if (angka2 === 0) {
        tampilkanHasil("Pembagian dengan nol tidak diperbolehkan", true);
        return;
      }
      hasil = angka1 / angka2;
      operasiText = "÷";
      break;
    default:
      tampilkanHasil("Operasi tidak dikenali", true);
      return;
  }

  const hasilBulat = Math.round(hasil * 10000000000) / 10000000000;
  const hasilTeks = `${angka1} ${operasiText} ${angka2} = ${hasilBulat}`;
  tampilkanHasil(hasilTeks);
}

tambahBtn.addEventListener("click", function () {
  hitung("tambah");
});
kurangBtn.addEventListener("click", function () {
  hitung("kurang");
});
kaliBtn.addEventListener("click", function () {
  hitung("kali");
});
bagiBtn.addEventListener("click", function () {
  hitung("bagi");
});

angka1Input.addEventListener("keypress", function (e) {
  if ((e, key === "Enter")) {
    angka2Input.focus();
  }
});

angka2Input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    hitung("tambah");
  }
});

angka1Input.addEventListener("input", function () {
  if (resultContainer.classList.contains("error")) {
    resultContainer.classList.remove("error");
    hasilElement.textContent = "Hasil akan ditampilkan di sini";
  }
});

angka2Input.addEventListener("input", function () {
  if (resultContainer.classList.contains("error")) {
    resultContainer.classList.remove("error");
    hasilElement.textContent = "Hasil akan ditampilkan di sini";
  }
});
