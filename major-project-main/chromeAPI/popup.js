async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

var message = document.querySelector("#metaTable");

getCurrentTab().then((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id, allFrames: true },
      files: ["getPageMetas.js"],
    },
    function () {
      // If you try it into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText =
          "There was an error : \n" + chrome.runtime.lastError.message;
      }
    }
  );
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  console.log({ request, aakash: "aakaah" });
  var metaTable = document.getElementById("metaTable");
  var str = "";
  if (request.method == "getMetas") {
    for (var i = 0; i < request.metas.length; i++) {
      if (
        request.metas[i][1] === "og:title" ||
        request.metas[i][1] === "og:description" ||
        request.metas[i][1] === "og:site_name" ||
        request.metas[i][0] === "title" ||
        request.metas[i][0] === "twitter:title" ||
        request.metas[i][0] === "description" ||
        request.metas[i][0] === "twitter:description" ||
        request.metas[i][0] === "keywords"
      ) {
        console.log(request.metas[i][0]);
        str += request.metas[i][3];
      }
      metaTable.innerHTML +=
        "<tr><td>" +
        request.metas[i][0] +
        "</td><td>" +
        request.metas[i][1] +
        "</td><td>" +
        request.metas[i][2] +
        "</td><td>" +
        request.metas[i][3] +
        "</td><td>" +
        request.metas[i][4] +
        "</td></tr>";
    }
    console.log("str is: ", str);
    fetch(`http://127.0.0.1:5000?id=${str}`)
      .then((r) => r.text())
      .then((category) => {
        fetch(`http://localhost:5050/api/posts/${category}`)
          .then((data) => data.json())
          .then(({ img, url }) => {
            const imageSrc =
              "https://finalyear2023.s3.ap-south-1.amazonaws.com/" + img;
            console.log("yaha aaya", imageSrc);
            chrome.tabs.query(
              { currentWindow: true, active: true },
              function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(
                  activeTab.id,
                  { message: imageSrc, url: url },
                  (response) => {
                    console.log({ response });
                  }
                );
              }
            );
          });
      });
  }
});
