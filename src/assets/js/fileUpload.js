let dropArea = document.getElementById('drop-area');
let fileList = document.getElementById('file-list');
let uploadedFiles = [];
// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.style.borderColor = 'black';
}

function unhighlight(e) {
    dropArea.style.borderColor = '#ccc';
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    ([...files]).forEach(file => {
        uploadedFiles.push(file);
        addFileToList(file);
    });
}

function addFileToList(file) {
    let fileItem = document.createElement('div');
    fileItem.className = 'files__item';
    fileItem.innerHTML = `
        <span class="files__info"><i class="material-symbols-outlined">text_snippet</i><span>${file.name} [${file.type}, ${Math.round(file.size / 1024)}KB]</span></span>
        <button type="button" class="files__del" onclick="removeFile('${file.name}')"><i class="icon icon-del"></i>삭제</button>
    `;
    fileList.appendChild(fileItem);
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    updateFileList();
}

function updateFileList() {
    fileList.innerHTML = '';
    uploadedFiles.forEach(file => addFileToList(file));
}

function uploadFile(file) {
    let url = 'YOUR_UPLOAD_URL';
    let formData = new FormData();
    formData.append('file', file);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(() => { /* Done. Inform the user */ })
    .catch(() => { /* Error. Inform the user */ })
}