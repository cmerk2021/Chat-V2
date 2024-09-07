function insertElementsFromLog(logFile) {
    const responsiveTable = document.getElementById('responsive-table');
    const header = responsiveTable.querySelector('thead');
  
    // Assuming the log file has lines with the format: fingerprint,message,date,name
    fetch(logFile)
      .then(response => response.text())
      .then(data => {
        const lines = data.split('\n');
        const elements = lines.map(line => line.split(','));
  
        // Sort elements by date (assuming date is in new Date() format)
        elements.sort((a, b) => {
          const dateA = new Date(a[2]);
          const dateB = new Date(b[2]);
          return dateB.getTime() - dateA.getTime(); // Descending order for most recent first
        });
  
        // Insert elements after the header
        elements.forEach(element => {
          const newElement = document.createElement('li');
          newElement.innerHTML = `
            <div class="col col-1" data-label="Fingerprint">${element[0]}</div>
            <div class="col col-2" data-label="Message">${element[1]}</div>
            <div class="col col-3" data-label="Date">${element[2]}</div>
            <div class="col col-4" data-label="Name">${element[3]}</div>
          `;
          header.after(newElement);
        });
      })
      .catch(error => console.error('Error fetching log file:', error));
  }
  // document.getElementById("header")