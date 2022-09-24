const exportSVG = (fname, data, props) => {
  const text = `<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd"> 
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50cm"
      height="50cm"
      viewBox="0 0 50 50"
    >
      ${data.paths.map(
        p => `
          <path
            d="${p}"
            stroke="${props.stroke}"
            strokeWidth="${props.strokeWidth}"
            fill="none"
          />
      `
      )}
    </svg>
  `;

  const el = document.createElement("a");
  el.setAttribute(
    "href",
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`
  );

  el.setAttribute("download", fname);
  el.style.display = "none";

  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

export default exportSVG;
