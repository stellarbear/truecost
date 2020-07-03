const copyToClipboard = (text: string): void => {
    const copyFrom = document.createElement("textarea");
    const copyTo = document.getElementById("clipboard");
    copyFrom.textContent = text;

    if (copyTo != null) {
        copyTo.appendChild(copyFrom);

        copyFrom.select();
        document.execCommand("copy");

        copyTo.removeChild(copyFrom);
    }
};

export default copyToClipboard;
