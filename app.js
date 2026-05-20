const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw3Yxu-q45bEvzLk2fv963TLLT9_fb4Fd4pvBsq2HSbK5p_WWivJsLMun4L_6UbQB_n/exec";

let localDataCache = [];

document.addEventListener("DOMContentLoaded", () => {
    // Jalankan pengambilan data saat halaman web selesai dimuat
    loadDashboardData();

    // Listener untuk Interaksi Form Submit
    document.getElementById("form-booking").addEventListener("submit", handleFormSubmit);

    // Listener untuk Real-time Local Filtering (Pencarian)
    document.getElementById("search-bar").addEventListener("input", handleSearch);
});

// 1. READ ACTION: Mengambil Data dari API Apps Script
async function loadDashboardData() {
    toggleLoading(true);
    try {
        const response = await fetch(WEB_APP_URL);
        const result = await response.json();

        if (result.status === "success") {
            localDataCache = result.data;
            renderTableData(localDataCache);
            updateStatistics(localDataCache);
        } else {
            showToast("Gagal membaca database Google Sheets", "error");
        }
    } catch (err) {
        console.error("Fetch Error: ", err);
        showToast("Error Koneksi Database / Masalah CORS", "error");
    } finally {
        toggleLoading(false);
    }
}

// 2. RENDER ACTION: Mencetak Data ke Baris Tabel HTML
function renderTableData(dataList) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    if (dataList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">Tidak ada jadwal booking ditemukan.</td></tr>`;
        return;
    }

    dataList.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${row.ID}</strong></td>
            <td>${row.Nama}</td>
            <td>${row.Lapangan}</td>
            <td>${formatIndoDate(row.Tanggal)}</td>
            <td>${row.Jam} WIB</td>
            <td><span class="badge">${row.Status}</span></td>
        `;
        tableBody.appendChild(tr);
    });
}

// 3. CREATE ACTION: Mengirim Data Baru via POST
async function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById("btn-submit");
    
    const payload = {
        nama: document.getElementById("nama").value,
        lapangan: document.getElementById("lapangan").value,
        tanggal: document.getElementById("tanggal").value,
        jam: document.getElementById("jam").value
    };

    // UI Feedback: Kunci tombol saat sedang memproses
    submitBtn.disabled = true;
    submitBtn.innerText = "Mendaftarkan Jadwal...";

    try {
        // TRICK MENGATASI CORS: Gunakan mode cors dengan Content-Type text/plain
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

        const resData = await response.json();

        if (resData.status === "success") {
            showToast(resData.message, "success");
            document.getElementById("form-booking").reset();
            // Muat ulang data secara real-time setelah input berhasil
            await loadDashboardData();
        } else {
            showToast("Gagal menyimpan data: " + resData.message, "error");
        }
    } catch (err) {
        console.error("Post Error: ", err);
        showToast("Gagal mengirim data ke server API", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Amankan Jadwal";
    }
}

// 4. STATISTIK LOGIC: Menghitung Data Agregat Secara Dinamis
function updateStatistics(dataList) {
    document.getElementById("stat-total").innerText = dataList.length;

    const totalFutsal = dataList.filter(item => item.Lapangan.toLowerCase().includes("futsal")).length;
    const totalBadminton = dataList.filter(item => item.Lapangan.toLowerCase().includes("badminton")).length;

    document.getElementById("stat-futsal").innerText = totalFutsal;
    document.getElementById("stat-badminton").innerText = totalBadminton;
}

// 5. SEARCH LOGIC: Filter Karakter Lokal Tanpa Request API Berulang
function handleSearch(e) {
    const keyword = e.target.value.toLowerCase();
    const filteredResults = localDataCache.filter(item => 
        item.Nama.toLowerCase().includes(keyword) || 
        item.Lapangan.toLowerCase().includes(keyword)
    );
    renderTableData(filteredResults);
}

// UI UTILITIES FUNCTIONS
function toggleLoading(show) {
    const loader = document.getElementById("loading");
    const table = document.getElementById("main-table");
    if (show) {
        loader.classList.remove("hidden");
        table.classList.add("hidden");
    } else {
        loader.classList.add("hidden");
        table.classList.remove("hidden");
    }
}

function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.className = "toast hidden";
    }, 4000);
}

function formatIndoDate(dateString) {
    if(!dateString) return "-";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}