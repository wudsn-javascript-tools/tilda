// Whole-script strict mode syntax
"use strict";

function openMainTab(tabName) {
    let i;
    let x = document.getElementsByClassName("mainTab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

class CSV {
    constructor() { };

    downloadCSV(contentArray, filename) {
        let content = this.arrayToCsv(contentArray);
        this.downloadBlob(content, filename, 'text/csv;charset=utf-8;')

    }

    /**
    * Download contents as a file
    * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    */
    downloadBlob(content, filename, contentType) {
        // Create a blob
        var blob = new Blob([content], { type: contentType });
        var url = URL.createObjectURL(blob);

        // Create a link to download it
        var pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', filename);
        pom.click();
        // document.removeChild(pom);
    }


    arrayToCsv(data) {
        return data.map(row =>
            row
                .map(String)  // convert every value to String
                .map(v => v.replaceAll('"', '""'))  // escape double quotes
                .map(v => `"${v}"`)  // quote it
                .join(';')  // semicolon-separated
        ).join('\r\n');  // rows starting on new lines
    }

}
class Tilda {

    // 
    constructor() {
        this.data = new Data();
        this.columnCount = 2;

        this.articles = [];
        this.state = { eventDate: "", modelArray: [] };

        this.dateFormat = new Intl.DateTimeFormat("de-DE");

    }

    //
    initInternal() {
        this.articles = [];
        this.state.eventDate = this.dateFormat.format(new Date());
        this.state.modelArray = [];

        window.onbeforeunload = function (ev) {
            // Recommended
            ev.preventDefault();
            // Included for legacy support, e.g. Chrome/Edge < 119
            ev.returnValue = true;
        }

        let bonTable = document.getElementById("bonTable");
        let totalsTable = document.getElementById("totalsTable");
        let entryCount = this.data.entries.length;
        let category = "";
        let articleCount = 0;
        for (let i = 0; i < entryCount; i++) {
            if (this.data.entries[i].category != undefined &&
                this.data.entries[i].price == undefined) {
                category = this.data.entries[i].category;
            } else {
                this.articles[articleCount] = this.data.entries[i];
                this.articles[articleCount].category = category;
                articleCount++;
            }
        }
        let rowCount = Math.trunc((articleCount + this.columnCount - 1) / this.columnCount);
        let cellCount = rowCount * this.columnCount;

        let oldState = null;
        try {
            oldState = JSON.parse(localStorage.getItem('state'));
            if (oldState !== null) {
                this.state.eventDate = oldState.eventDate;
            }
        } catch {

        }
        document.getElementById("eventDate").innerText = this.state.eventDate;


        let i = 0;
        let bonTableHTML = "";
        let totalsTableHTML = "";
        let decimalPlaces = 0;
        for (let row = 0; row < rowCount; row++) {
            bonTableHTML += '<tr>';
            totalsTableHTML += '<tr>';

            for (let column = 0; column < this.columnCount; column++) {
                if (i < articleCount) {
                    let d = this.articles[i];

                    if (d.price != Math.trunc(d.price)) {
                        decimalPlaces = 2;
                    }
                    let bonAddArticleButtonID = 'bonAddArticleButton' + i;
                    let bonClearArticleCountButtonID = 'bonClearArticleCountButton' + i;
                    let bonArticleAmountElementID = 'bonArticleAmountField' + i;
                    let category = this.data.categories.find((element) => element.id == d.category);
                    // console.log(category);
                    let style = category.style;
                    let html1 =
                        `<td><button id="${bonAddArticleButtonID}" type="button" class="tildaAddButton" style="${style}" onclick="tilda.bonAddArticleButtonClicked(${i})">${bonAddArticleButtonID}</button></td><td><button id="${bonClearArticleCountButtonID}" type="button" onclick="tilda.bonClearArticleCountButtonClicked(${i})">0</button></td><td id="${bonArticleAmountElementID}" class="tildaAmountField"></td>`;
                    bonTableHTML = bonTableHTML + html1;

                    let totalsLabelID = 'totalsLabel' + i;
                    let totalsPriceFieldID = 'totalsPriceField' + i;
                    let totalsCountFieldID = 'totalsCountField' + i;
                    let totalsAmountFieldID = 'totalsAmountField' + i;
                    let html2 =
                        `<td id="${totalsLabelID}" class="tildaTotalLabel" style="${style}"><td id="${totalsPriceFieldID}" class="tildaTotalPrice" style="${style}"></td><td id="${totalsCountFieldID}" class="totalCountField" style="${style}"><td id="${totalsAmountFieldID}" class="tildaAmountField" style="${style}"></td>`;
                    totalsTableHTML = totalsTableHTML + html2;

                    // Get total count from previously stored modelArray?
                    let totalCount = 0;
                    if (oldState !== null) {
                        if (oldState.modelArray[i] !== undefined) {
                            totalCount = oldState.modelArray[i].totalCount;
                        }
                    }
                    this.state.modelArray[i] = {
                        bonAddArticleButtonID: bonAddArticleButtonID, bonArticleCount: 0, bonClearArticleCountButtonID: bonClearArticleCountButtonID, bonArticleAmountElementID: bonArticleAmountElementID, bonArticleAmount: 0,
                        totalsLabelID: totalsLabelID, totalsPriceFieldID: totalsPriceFieldID, totalsCountFieldID: totalsCountFieldID, totalCount: totalCount, totalsAmountFieldID: totalsAmountFieldID, totalAmount: 0
                    };
                }

                i++;
            }
            bonTableHTML += '</tr>';
            totalsTableHTML += '</tr>';

        }

        // Bon table
        // console.log(bonTableHTML);
        bonTable.innerHTML = bonTableHTML;

        let bonPostButtonID = 'bonPostButton';
        let bonClearArticleCountsButtonID = 'bonClearArticleCountsButton';
        let bonTotalAmountFieldID = 'bonTotalAmountField';
        let html1 = `<tr><td><button id="${bonPostButtonID}" type="button" class="tildaPostButton" onclick="tilda.bonPostButtonClicked()">Buchen</button></td><td><button id="${bonClearArticleCountsButtonID}" type="button" onclick="tilda.bonClearArticleCountsButtonClicked()">0</button></td><td id="${bonTotalAmountFieldID}" class="tildaAmountField"></td>`;
        '</tr>';
        bonTable.innerHTML += html1;

        // Totals table
        totalsTable.innerHTML = totalsTableHTML;

        let clearTotalsButtonID = 'clearTotalsButton';

        // Adjust number for fraction digits.
        this.amountFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });

        this.refreshTables();
    }

    init() {
        try {
            this.initInternal();
        } catch (error) {
            window.alert(error);
        }
    }


    refreshTables() {
        let bonTotalAmount = 0;
        let totalsTotalAmount = 0;
        for (let i = 0; i < this.state.modelArray.length; i++) {
            let model = this.state.modelArray[i];
            let articlePrice = this.articles[i].price;

            let formattedArticlePrice = '-';
            if (articlePrice !== 0) {
                formattedArticlePrice = this.amountFormat.format(articlePrice);
            }

            model.bonArticleAmount = model.bonArticleCount * articlePrice;
            let bonFormattedArticleAmount = '';
            if (model.articleAmount !== 0) {
                bonFormattedArticleAmount = this.amountFormat.format(model.bonArticleAmount);
                bonTotalAmount += model.bonArticleAmount;
            }

            document.getElementById(model.bonAddArticleButtonID).innerHTML = `${this.articles[i].text}<span style="float:right;"">${formattedArticlePrice}</span>`;
            document.getElementById(model.bonAddArticleButtonID).disabled = (articlePrice == 0);
            document.getElementById(model.bonClearArticleCountButtonID).innerHTML = model.bonArticleCount;
            document.getElementById(model.bonClearArticleCountButtonID).disabled = (model.bonArticleCount == 0);
            document.getElementById(model.bonArticleAmountElementID).innerHTML = bonFormattedArticleAmount;


            model.totalAmount = articlePrice * model.totalCount;
            totalsTotalAmount += model.totalAmount;

            let formattedTotalAmount = this.amountFormat.format(model.totalAmount);
            document.getElementById(model.totalsLabelID).innerText = this.articles[i].text;
            document.getElementById(model.totalsPriceFieldID).innerText = formattedArticlePrice;
            document.getElementById(model.totalsCountFieldID).innerText = model.totalCount;
            document.getElementById(model.totalsAmountFieldID).innerHTML = formattedTotalAmount;

        }

        // Bon table
        document.getElementById("bonPostButton").disabled = (bonTotalAmount == 0);
        document.getElementById("bonClearArticleCountsButton").disabled = (bonTotalAmount == 0);
        let bonFormattedTotalAmount = this.amountFormat.format(bonTotalAmount);
        document.getElementById("bonTotalAmountField").innerHTML = bonFormattedTotalAmount;

        // Totals
        let totalsFormattedTotalAmount = this.amountFormat.format(totalsTotalAmount);
        document.getElementById("totalsTotalAmountField").innerHTML = totalsFormattedTotalAmount;
    }

    bonAddArticleButtonClicked(index) {
        this.state.modelArray[index].bonArticleCount++;
        this.refreshTables();
    }

    bonClearArticleCountButtonClicked(index) {
        this.state.modelArray[index].bonArticleCount = 0;
        this.refreshTables();
    }


    bonPostButtonClicked() {
        for (let i = 0; i < this.state.modelArray.length; i++) {
            this.state.modelArray[i].totalCount += this.state.modelArray[i].bonArticleCount;
        }
        localStorage.setItem("state", JSON.stringify(this.state));

        this.bonClearArticleCountsButtonClicked();
    }

    bonClearArticleCountsButtonClicked() {
        for (let i = 0; i < this.state.modelArray.length; i++) {
            this.state.modelArray[i].bonArticleCount = 0;
        }
        this.refreshTables();
    }

    totalsExportTotalsButtonClicked() {
        let row = 0;
        let contentArray = [];
        contentArray[row++] = ["Artikel", "Preis [€]", "Anzahl", "Umsatz [€]"];
        let totalCount = 0;
        let totalAmount = 0;
        for (let i = 0; i < this.state.modelArray.length; i++) {
            contentArray[row++] = [this.articles[i].text, this.articles[i].price, this.state.modelArray[i].totalCount, this.state.modelArray[i].totalAmount];
            totalCount += this.state.modelArray[i].totalCount;
            totalAmount += this.state.modelArray[i].totalAmount;
        }
        contentArray[row++] = ["Gesamt", "", totalCount, totalAmount];;
        let csv = new CSV();
        csv.downloadCSV(contentArray, "tilda.csv");
    }

    totalsClearTotalsButtonClicked() {
        if (confirm("Wollen Sie wirklich alles löschen?")) {
            var state = localStorage.removeItem('state');
            this.init();
            this.refreshTables();
        }
    }
}