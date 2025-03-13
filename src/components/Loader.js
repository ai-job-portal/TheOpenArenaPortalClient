// loader.js

/**
 * Creates and controls a generic loader element.
 */
const Loader = {
    /**
     * The loader element.
     * @type {HTMLElement|null}
     */
    loaderElement: null,
  
    /**
     * Creates the loader element and appends it to the body.
     * @param {string} [message="Loading..."] - The message to display in the loader.
     */
    create: function (message = "Loading...") {
      if (this.loaderElement) {
        return; // Loader already created
      }
  
      this.loaderElement = document.createElement("div");
      this.loaderElement.classList.add("loader-container"); // Add a class for styling
  
      const loaderContent = document.createElement("div");
      loaderContent.classList.add("loader-content"); // Add a class for styling
  
      const spinner = document.createElement("div");
      spinner.classList.add("loader-spinner"); // Add a class for styling
  
      const messageElement = document.createElement("p");
      messageElement.classList.add("loader-message");
      messageElement.textContent = message;
  
      loaderContent.appendChild(spinner);
      loaderContent.appendChild(messageElement);
      this.loaderElement.appendChild(loaderContent);
      document.body.appendChild(this.loaderElement);
  
      // Optional: Add a style tag for basic styling (or use an external CSS file)
      const style = document.createElement('style');
      style.textContent = `
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* Ensure it's on top */
        }
  
        .loader-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
  
        .loader-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #3498db; /* Your preferred spinner color */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
  
        .loader-message {
          margin: 0;
        }
  
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    },
  
    /**
     * Shows the loader.
     */
    show: function () {
      if (this.loaderElement) {
        this.loaderElement.style.display = "flex";
      } else {
          this.create();
          this.show();
      }
    },
  
    /**
     * Hides the loader.
     */
    hide: function () {
      if (this.loaderElement) {
        this.loaderElement.style.display = "none";
      }
    },
  
    /**
     * Removes the loader element from the DOM.
     */
    remove: function () {
      if (this.loaderElement) {
        document.body.removeChild(this.loaderElement);
        this.loaderElement = null;
      }
    },
  };
  
  export default Loader; // Export for use in modules