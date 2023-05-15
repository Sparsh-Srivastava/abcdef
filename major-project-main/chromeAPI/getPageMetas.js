var metas = document.getElementsByTagName("meta");
console.log("metas", metas);
var metaArr = [];
for (var i = 0; i < metas.length; i++) {
	var name = metas[i].getAttribute("name");
	var property = metas[i].getAttribute("property");
	var httpequiv = metas[i].getAttribute("http-equiv");
	var content = metas[i].getAttribute("content");
	var charset = metas[i].getAttribute("charset");

	metaArr.push([name, property, httpequiv, content, charset]);
}

chrome.runtime.sendMessage({
	method: "getMetas",
	metas: metaArr,
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("request", request);
	if (request.message && request.url) {
		const adDiv = document.createElement("div");
		adDiv.width = "400px";
		adDiv.height = "400px";
		adDiv.setAttribute(
			"style",
			"display:block;position:fixed;top:100%;left:0;transform:translate(0,-100%);cursor:pointer;width:400px;height:400px;"
		);
		adDiv.onclick = () => {
			window.location.href = request.url;
		};
		const image = document.createElement("img");
		image.src = request.message;
		image.setAttribute("style", "width:100%;height:100%;");
		adDiv.appendChild(image);
		const closeTag = document.createElement("button");
		closeTag.setAttribute(
			"style",
			"position:absolute;top:0;right:0;width:fit-content;height:auto;color:#000000;"
		);
		closeTag.textContent = "Close";
		closeTag.onclick = (e) => {
			e.stopPropagation();
			document.body.removeChild(adDiv);
		};
		adDiv.appendChild(closeTag);

		document.body.appendChild(adDiv);
	}
	return true;
});
