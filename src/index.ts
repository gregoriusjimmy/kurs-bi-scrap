const PORT = 8000;
import axios from "axios";
import express from "express";
const app = express();
import cors from "cors";
app.use(cors());
import * as cheerio from "cheerio";

type TKurs = {
  mataUang: string;
  nilai: string;
  kursJual: string;
  kursBeli: string;
};

const URL =
  "https://www.bi.go.id/id/statistik/informasi-kurs/transaksi-bi/default.aspx";

app.get("/kurs-bi", function (req, res) {
  axios(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const result: TKurs[] = [];
      $("tbody")
        .last()
        .find("tr")
        .each((_, tr) => {
          const kurs: TKurs = {
            mataUang: null,
            nilai: null,
            kursJual: null,
            kursBeli: null,
          };
          $(tr)
            .find("td")
            .each((idx, td) => {
              const text = $(td).text();
              switch (idx) {
                case 0:
                  kurs["mataUang"] = text;
                case 1:
                  kurs["nilai"] = text;
                case 2:
                  kurs["kursJual"] = text;
                case 3:
                  kurs["kursBeli"] = text;
                default:
                  break;
              }
            });
          result.push(kurs);
        });
      res.json(result);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
