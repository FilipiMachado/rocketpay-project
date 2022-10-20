import IMask from "imask";
import "./css/index.css";

const ccBgColor01 = document.querySelector(
  ".cc-bg svg > g g:nth-child(1) path"
);
const ccBgColor02 = document.querySelector(
  ".cc-bg svg > g g:nth-child(2) path"
);
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#00A4E0", "#EF4223"],
    nubank: ["#fff", "#944CB7"],
    default: ["black", "grey"],
  };

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

setCardType("default");

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "0000",
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000  0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000  0000",
      regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000  0000",
      cardtype: "default",
    },
    /* {
      mask: "0000 0000 0000  0000",
      cardtype: "elo"
    },
    {
      mask: "0000 0000 0000  0000",
      cardtype: "nubank"
    }, */
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });

    return foundMask;
  },
};

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const addCardButton = document.querySelector("#add-card-btn");

addCardButton.addEventListener("click", () => {
  alert("Cartão adicionado!");
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
});

const cardHolder = document.querySelector("#card-holder");

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = cardHolder.value;

  if (cardHolder.value == "") {
    ccHolder.innerText = "Fulano da Silva";
  }
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");

  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccCardNumber = document.querySelector(".cc-number");

  ccCardNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value);
});

function updateExpirationDate(date) {
  const ccExpirationDate = document.querySelector(".cc-extra .value");

  ccExpirationDate.innerText = date.length === 0 ? "02/32" : date;
}
