// Mendapatkan elemen-elemen dari DOM
const angka1Input = document.getElementById("angka1");
const angka2Input = document.getElementById("angka2");
const tambahBtn = document.getElementById("tambahBtn");
const kurangBtn = document.getElementById("kurangBtn");
const kaliBtn = document.getElementById("kaliBtn");
const bagiBtn = document.getElementById("bagiBtn");
const hasilElement = document.getElementById("hasil");
const resultContainer = document.querySelector(".result-container");

// Fungsi untuk validasi input
function validateInput(nilai1, nilai2) {
  if (nilai1 === "" || nilai2 === "") {
    return "Mohon masukkan kedua angka!";
  }

  if (isNaN(nilai1) || isNaN(nilai2)) {
    return "Mohon masukkan angka yang valid!";
  }

  return null; // Tidak ada error
}

// Fungsi untuk menampilkan hasil
function tampilkanHasil(hasil, isError = false) {
  hasilElement.textContent = hasil;

  // Reset classes
  resultContainer.classList.remove("error", "success");

  if (isError) {
    resultContainer.classList.add("error");
  } else {
    resultContainer.classList.add("success");
  }
}

// Fungsi untuk melakukan perhitungan
function hitung(operasi) {
  // Mendapatkan nilai dari input
  const nilai1 = angka1Input.value.trim();
  const nilai2 = angka2Input.value.trim();

  // Validasi input
  const error = validateInput(nilai1, nilai2);
  if (error) {
    tampilkanHasil(error, true);
    return;
  }

  // Konversi ke angka
  const angka1 = parseFloat(nilai1);
  const angka2 = parseFloat(nilai2);

  let hasil;
  let operasiText;

  // Melakukan operasi berdasarkan parameter
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
      operasiText = "×";
      break;
    case "bagi":
      if (angka2 === 0) {
        tampilkanHasil("Error: Tidak dapat membagi dengan nol!", true);
        return;
      }
      hasil = angka1 / angka2;
      operasiText = "÷";
      break;
    default:
      tampilkanHasil("Operasi tidak valid!", true);
      return;
  }

  // Membulatkan hasil jika perlu (maksimal 10 desimal)
  const hasilBulat = Math.round(hasil * 10000000000) / 10000000000;

  // Menampilkan hasil dengan format yang rapi
  const hasilText = `${angka1} ${operasiText} ${angka2} = ${hasilBulat}`;
  tampilkanHasil(hasilText);
}

// Event listeners untuk setiap tombol operasi
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

// Event listener untuk Enter key pada input
angka1Input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    angka2Input.focus();
  }
});

angka2Input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    // Lakukan operasi terakhir yang dipilih, atau default ke penjumlahan
    hitung("tambah");
  }
});

// Menghapus pesan error saat user mulai mengetik
angka1Input.addEventListener("input", function () {
  if (resultContainer.classList.contains("error")) {
    resultContainer.classList.remove("error");
    hasilElement.textContent = "Hasil akan muncul di sini";
  }
});

angka2Input.addEventListener("input", function () {
  if (resultContainer.classList.contains("error")) {
    resultContainer.classList.remove("error");
    hasilElement.textContent = "Hasil akan muncul di sini";
  }
});
