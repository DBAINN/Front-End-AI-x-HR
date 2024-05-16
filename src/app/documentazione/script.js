let fileInput=document.getElementById("file-input");
let fileList = document.getElementById("files-list");
let numOfFiles =  document.getElementById("num-of-files");
fileInput.addEventListener("change",()=>{
    fileList.innerHTML="";
    numOfFiles.textContent= `${fileInput.files.length} Files Selezionati`;
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        console.log(file);

        // Crea un elemento <li> per ciascun file selezionato e aggiungilo alla lista
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        fileList.appendChild(listItem);

        // Leggi il contenuto del file utilizzando FileReader se necessario
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            console.log("Contenuto del file:", fileContent);
        };
        reader.readAsText(file); // Leggi il contenuto del file come testo
    } 
});