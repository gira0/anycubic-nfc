// This file contains the JavaScript code that replicates the functionality of the provided Python script.

document.addEventListener("DOMContentLoaded", function() {
    const materialInput = document.getElementById("material");
    const colorInput = document.getElementById("color");
    const colorPicker = document.getElementById("colorPicker");
    const hotendTempMinInput = document.getElementById("hotendTempMin");
    const hotendTempMaxInput = document.getElementById("hotendTempMax");
    const bedTempMinInput = document.getElementById("bedTempMin");
    const bedTempMaxInput = document.getElementById("bedTempMax");
    const overrideLimitsCheckbox = document.getElementById("overrideLimits");
    const outputDiv = document.getElementById("output");
    const copyButton = document.getElementById("copy");

    if (!materialInput || !colorInput || !colorPicker || !hotendTempMinInput || !hotendTempMaxInput || !bedTempMinInput || !bedTempMaxInput || !outputDiv || !copyButton || !overrideLimitsCheckbox) {
        console.error("One or more elements are missing from the DOM.");
        return;
    }

    function hexToRGBA(hex) {
        let r, g, b, a;
        if (hex.length === 8) {
            a = hex.slice(0, 2);
            r = hex.slice(2, 4);
            g = hex.slice(4, 6);
            b = hex.slice(6, 8);
        } else {
            a = "FF";
            r = hex.slice(0, 2);
            g = hex.slice(2, 4);
            b = hex.slice(4, 6);
        }
        return { t: a.toUpperCase(), r: r.toUpperCase(), g: g.toUpperCase(), b: b.toUpperCase() };
    }

    function generateHexString(material, color, hotendTempMin, hotendTempMax, bedTempMin, bedTempMax) {
        const M = Array.from(material).map(m => m.charCodeAt(0).toString(16).toUpperCase());
        while (M.length < 20) {
            M.push("00");
        }

        const { t, r, g, b } = hexToRGBA(color.replace("#", ""));
        return `
A2:04:7B:00:65:00,
A2:05:41:48:50:4C,
A2:06:50:42:57:2D,
A2:07:31:30:32:00,
A2:08:00:00:00:00,
A2:09:00:00:00:00,
A2:0A:41:43:00:00,
A2:0B:00:00:00:00,
A2:0C:00:00:00:00,
A2:0D:00:00:00:00,
A2:0E:00:00:00:00,
A2:0F:${M[0]}:${M[1]}:${M[2]}:${M[3]},
A2:10:${M[4]}:${M[5]}:${M[6]}:${M[7]},
A2:11:${M[8]}:${M[9]}:${M[10]}:${M[11]},
A2:12:${M[12]}:${M[13]}:${M[14]}:${M[15]},
A2:13:${M[16]}:${M[17]}:${M[18]}:${M[19]},
A2:14:${t}:${b}:${g}:${r},
A2:15:00:00:00:00,
A2:16:00:00:00:00,
A2:17:${hotendTempMin.toString(16).toUpperCase()}:00:${hotendTempMax.toString(16).toUpperCase()}:00,
A2:18:${hotendTempMin.toString(16).toUpperCase()}:00:${hotendTempMax.toString(16).toUpperCase()}:00,
A2:19:${hotendTempMin.toString(16).toUpperCase()}:00:${hotendTempMax.toString(16).toUpperCase()}:00,
A2:1A:${hotendTempMin.toString(16).toUpperCase()}:00:${hotendTempMax.toString(16).toUpperCase()}:00,
A2:1B:${hotendTempMin.toString(16).toUpperCase()}:00:${hotendTempMax.toString(16).toUpperCase()}:00,
A2:1C:${hotendTempMin.toString(16).toUpperCase()}:00:${hotendTempMax.toString(16).toUpperCase()}:00,
A2:1D:${bedTempMin.toString(16).toUpperCase()}:00:${bedTempMax.toString(16).toUpperCase()}:00,
A2:1E:${(1.75 * 100).toString(16).toUpperCase()}:00:4A:01,
A2:1F:E8:03:00:00,
A2:20:00:00:00:00,
A2:21:00:00:00:00,
A2:22:00:00:00:00,
A2:23:00:00:00:00,
A2:24:00:00:00:00,
A2:25:00:00:00:00,
A2:26:00:00:00:00,
A2:27:00:00:00:00,
A2:28:00:00:00:BD,
A2:29:04:00:00:04,
A2:2A:47:00:00:00,
A2:2B:00:00:00:00,
A2:2C:00:00:00:00
        `;
    }

    document.getElementById("generate").addEventListener("click", function() {
        const material = materialInput.value || "PLA+";
        const color = colorInput.value || "#660000"; // Default color
        let hotendTempMin = parseInt(hotendTempMinInput.value) || 240;
        let hotendTempMax = parseInt(hotendTempMaxInput.value) || 260;
        let bedTempMin = parseInt(bedTempMinInput.value) || 90;
        let bedTempMax = parseInt(bedTempMaxInput.value) || 115;

        if (!overrideLimitsCheckbox.checked) {
            hotendTempMin = Math.max(180, Math.min(hotendTempMin, 300)); // Limit between 180 and 300
            hotendTempMax = Math.max(180, Math.min(hotendTempMax, 300)); // Limit between 180 and 300
            bedTempMin = Math.max(0, Math.min(bedTempMin, 120)); // Limit between 0 and 120
            bedTempMax = Math.max(0, Math.min(bedTempMax, 120)); // Limit between 0 and 120
        }

        const hexString = generateHexString(material, color, hotendTempMin, hotendTempMax, bedTempMin, bedTempMax);
        outputDiv.textContent = hexString;
    });

    overrideLimitsCheckbox.addEventListener('change', function() {
        if (overrideLimitsCheckbox.checked) {
            hotendTempMinInput.removeAttribute('min');
            hotendTempMinInput.removeAttribute('max');
            hotendTempMaxInput.removeAttribute('min');
            hotendTempMaxInput.removeAttribute('max');
            bedTempMinInput.removeAttribute('min');
            bedTempMinInput.removeAttribute('max');
            bedTempMaxInput.removeAttribute('min');
            bedTempMaxInput.removeAttribute('max');
        } else {
            hotendTempMinInput.setAttribute('min', '180');
            hotendTempMinInput.setAttribute('max', '300');
            hotendTempMaxInput.setAttribute('min', '180');
            hotendTempMaxInput.setAttribute('max', '300');
            bedTempMinInput.setAttribute('min', '0');
            bedTempMinInput.setAttribute('max', '120');
            bedTempMaxInput.setAttribute('min', '0');
            bedTempMaxInput.setAttribute('max', '120');

            // Round to safe limits
            hotendTempMinInput.value = Math.max(180, Math.min(parseInt(hotendTempMinInput.value) || 240, 300));
            hotendTempMaxInput.value = Math.max(180, Math.min(parseInt(hotendTempMaxInput.value) || 260, 300));
            bedTempMinInput.value = Math.max(0, Math.min(parseInt(bedTempMinInput.value) || 90, 120));
            bedTempMaxInput.value = Math.max(0, Math.min(parseInt(bedTempMaxInput.value) || 115, 120));

            // Ensure min is not greater than max and vice versa
            if (parseInt(hotendTempMinInput.value) > parseInt(hotendTempMaxInput.value)) {
                hotendTempMaxInput.value = hotendTempMinInput.value;
            }
            if (parseInt(hotendTempMaxInput.value) < parseInt(hotendTempMinInput.value)) {
                hotendTempMinInput.value = hotendTempMaxInput.value;
            }
            if (parseInt(bedTempMinInput.value) > parseInt(bedTempMaxInput.value)) {
                bedTempMaxInput.value = bedTempMinInput.value;
            }
            if (parseInt(bedTempMaxInput.value) < parseInt(bedTempMinInput.value)) {
                bedTempMinInput.value = bedTempMaxInput.value;
            }
        }
    });

    function validateTempInputs() {
        if (parseInt(hotendTempMinInput.value) > parseInt(hotendTempMaxInput.value)) {
            hotendTempMaxInput.value = hotendTempMinInput.value;
        }
        if (parseInt(hotendTempMaxInput.value) < parseInt(hotendTempMinInput.value)) {
            hotendTempMinInput.value = hotendTempMaxInput.value;
        }
        if (parseInt(bedTempMinInput.value) > parseInt(bedTempMaxInput.value)) {
            bedTempMaxInput.value = bedTempMinInput.value;
        }
        if (parseInt(bedTempMaxInput.value) < parseInt(bedTempMinInput.value)) {
            bedTempMinInput.value = bedTempMaxInput.value;
        }
    }

    hotendTempMinInput.addEventListener('input', validateTempInputs);
    hotendTempMaxInput.addEventListener('input', validateTempInputs);
    bedTempMinInput.addEventListener('input', validateTempInputs);
    bedTempMaxInput.addEventListener('input', validateTempInputs);

    copyButton.addEventListener("click", function() {
        navigator.clipboard.writeText(outputDiv.textContent).then(() => {
            alert("Hex string copied to clipboard!");
        });
    });

    colorPicker.addEventListener('input', function() {
        colorInput.value = colorPicker.value;
        colorInput.style.backgroundColor = colorPicker.value; // Update background color
    });

    colorInput.addEventListener('input', function() {
        colorPicker.value = colorInput.value;
        colorInput.style.backgroundColor = colorInput.value; // Update background color
    });

    // Set initial background color for color input
    colorInput.style.backgroundColor = colorInput.value;

    document.getElementById('writeNFC').addEventListener('click', async () => {
        try {
            const ndef = new NDEFReader();
            await ndef.write(outputDiv.textContent);
            console.log("NFC tag written successfully.");
        } catch (error) {
            console.error("Error writing to NFC tag:", error);
        }
    });

    document.getElementById('readNFC').addEventListener('click', async () => {
        try {
            const ndef = new NDEFReader();
            await ndef.scan();
            ndef.onreading = event => {
                const decoder = new TextDecoder();
                for (const record of event.message.records) {
                    console.log("NFC tag read:", decoder.decode(record.data));
                    outputDiv.textContent = decoder.decode(record.data);
                }
            };
            console.log("NFC tag read successfully.");
        } catch (error) {
            console.error("Error reading from NFC tag:", error);
        }
    });
});