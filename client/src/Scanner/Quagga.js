import React, { useEffect, useState } from "react";
import config from "./config.json";
import Quagga from "client/src/Scanner/Quagga";
import { parseProductData } from "./productSearch";

export default function QuaggaScanner(props) {
  const { onDetected } = props;

  const defaultColour = "#282c34";
  const [flags, setFlags] = useState("No Ingredients Found");
  const [colour, setColour] = useState("#282c34");

  useEffect(() => {
    Quagga.init(
      {
        numOfWorkers: 4,
        debug: true,
        locate: true,
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#qr-reader"), // Or '#yourElement' (optional)
        },
        constraints: {
          width: 200,
          height: 100,
          facingMode: "environment",
        },
        decoder: {
          readers: ["upc_reader"],
          debug: {
            drawBoundingBox: true,
            drawScanline: true,
          },
        },
      },
      function (err) {
        if (err) {
          //   console.log(err);
          return;
        }
        Quagga.start();
      }
    );
    var lastDetection;
    Quagga.onDetected(function (result) {
      var code = result.codeResult.code;
      if (code == null || code === lastDetection) {
        return;
      }
      lastDetection = code;
      console.log("Barcode detected and processed : [" + code + "]", result);
      var cacheData = {
        "064100389014": {
          status: 1,
          product: {
            _keywords: ["rice", "Kelloggs", "square"],
            ingredients: [
              { text: "rice" },
              { text: "sugar" },
              { text: "cereal" },
            ],
            brands: "Kellogg",
          },
        },
        "063348100900": {
          status: 1,
          product: {
            _keywords: [],
            ingredients: [{ text: "chocolate" }, { text: "palm oil" }],
            brands: "Dare",
          },
        },
      };
      //     fetch('https://world.openfoodfacts.org/api/v0/product/' + code)
      //         .then((response) => response.json())
      //         .then((json) => {
      //             let warningIngredients = parseProductData(json);
      //             if (warningIngredients != null) {
      //                 document.getElementById('flags').innerText =
      //                     warningIngredients;
      //             }
      //         });
      let warningIngredients = parseProductData(cacheData[code]);
      let flagRows = [
        <>
          <h3>
            High Emission Ingredients Found: <br></br>
          </h3>
        </>,
      ];
      if (warningIngredients != null) {
        warningIngredients.forEach((x) => {
          flagRows.push(
            <>
              {x}
              <br></br>
            </>
          );
        });
        flagRows.push(
          <a href="https://www.visualcapitalist.com/visualising-the-greenhouse-gas-impact-of-each-food/">
            Learn More
          </a>
        );
        setFlags(flagRows);
        setColour("#aa3333");
        setTimeout(() => setColour(defaultColour), 1000);
      }
    });
  }, []);

  // return <div id="interactive" className="viewport" />;
  return (
    <div id="quagga-scanner">
      <div id="interactive" className="viewport" />
    </div>
  );
}