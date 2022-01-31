document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("onDataSaved", () => {
  console.log("data berhasil disimpan");
});

document.addEventListener("onDataLoaded", () => {
  refreshDataFromBooks();
});
