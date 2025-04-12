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

class Tilda {

    // 
    constructor() {
        this.data = new Data();
        this.columnCount = 2;

        this.articles = [];
        this.modelArray = [];

    }


    refreshArticlesTable() {
        let totalAmount = 0;
        for (let i = 0; i < this.modelArray.length; i++) {
            let model = this.modelArray[i];
            let articlePrice = this.articles[i].price;
            let formatedArticleCount = '';
            if (model.articleCount !== 0) {
                formatedArticleCount = model.articleCount;
            }
            let formattedArticlePrice = '-';
            if (articlePrice !== 0) {
                formattedArticlePrice = this.amountFormat.format(articlePrice);
            }

            model.articleAmount = model.articleCount * articlePrice;
            let formattedArticleAmount = '';
            if (model.articleAmount !== 0) {
                formattedArticleAmount = this.amountFormat.format(model.articleAmount);
                totalAmount += model.articleAmount;
            }

            // console.log('Refresh line index  ' + i + ': ' + formatedArticleCount + ' ' + formattedArticlePrice + '  ' + formattedArticleAmount + '.');


            document.getElementById(model.articleAddButtonID).innerHTML = this.articles[i].text + '<span style="float:right;"">' + formattedArticlePrice + '</span>';
            document.getElementById(model.articleAddButtonID).disabled = (articlePrice == 0);
            document.getElementById(model.articleClearButtonID).disabled = (model.articleCount == 0);
            document.getElementById(model.articleClearButtonID).innerHTML = model.articleCount;
            document.getElementById(model.articleAmountElementID).innerHTML = formattedArticleAmount;

            model.totalAmount = articlePrice * model.totalCount;
            let formattedTotalAmount = this.amountFormat.format(model.totalAmount);
            document.getElementById(model.totalLabelID).innerText = this.articles[i].text;
            document.getElementById(model.totalPriceFieldID).innerText = formattedArticlePrice;
            document.getElementById(model.totalCountFieldID).innerText = model.totalCount;
            document.getElementById(model.totalAmountFieldID).innerHTML = formattedTotalAmount;

        }

        let formattedTotalAmount = this.amountFormat.format(totalAmount);

        document.getElementById("postAllButton").disabled = (totalAmount == 0);
        document.getElementById("clearAllButton").disabled = (totalAmount == 0);

        document.getElementById("totalAmountField").innerHTML = formattedTotalAmount;
    }

    //
    init() {
        this.articles = [];
        this.modelArray = [];

        window.onbeforeunload = function (ev) {
            // Recommended
            ev.preventDefault();
            // Included for legacy support, e.g. Chrome/Edge < 119
            ev.returnValue = true;
        }

        let bonTable = document.getElementById("articlesTable");
        let totalsTable = document.getElementById("totalsTable");
        let entryCount = this.data.entries.length;
        let category = "";
        let articleCount = 0;
        for (let i = 0; i < entryCount; i++) {
            if (this.data.entries[i].category != undefined &&
                this.data.entries[i].price == undefined ) {
                category = this.data.entries[i].category;
            } else {
                this.articles[articleCount] = this.data.entries[i];
                this.articles[articleCount].category = category;
                articleCount++;
            }
        }
        let rowCount = Math.trunc((articleCount + this.columnCount - 1) / this.columnCount);
        let cellCount = rowCount * this.columnCount;

        let state = null;
        try {
            state = JSON.parse(localStorage.getItem('modelArray'));
        } catch {

        }

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
                    let addButtonID = 'addButton' + i;
                    let clearButtonID = 'clearButton' + i;
                    let amountFieldID = 'amountField' + i;
                    let category = this.data.categories.find((element) => element.id == d.category);
                    console.log(category);
                    let style = 'background-color:' + category.color + ';';
                    if (category.id == 'c5') {
                        style += 'color:#ff2738; font-weight:bold;';
                    }
                    let html1 =
                        '<td><button id="' + addButtonID + '" type="button" class="tildaAddButton" style="' + style + '" onclick="tilda.addButtonClicked(' + i + ')">' + addButtonID + '</button></td>' +
                        '<td><button id="' + clearButtonID + '" type="button" onclick="tilda.clearButtonClicked(' + i + ')">0</button></td>' +
                        '<td id="' + amountFieldID + '" class="tildaAmountField"></td>';
                    bonTableHTML = bonTableHTML + html1;

                    let totalLabelID = 'totalLabel' + i;
                    let totalPriceFieldID = 'totalPriceField' + i;
                    let totalCountFieldID = 'totalCountField' + i;
                    let totalAmountFieldID = 'totalAmountField' + i;
                    let html2 =
                        '<td id="' + totalLabelID + '" class="tildaTotalLabel" style="' + style + '"><td id="' + totalPriceFieldID + '" class="tildaTotalPrice" style="' + style + '"></td>' +
                        '<td id="' + totalCountFieldID + '" class="totalCountField" style="' + style + '"><td id="' + totalAmountFieldID + '" class="tildaAmountField" style="' + style + '"></td>';
                    totalsTableHTML = totalsTableHTML + html2;

                    // Get total cound from previously stored modelArray?
                    let totalCount=0;
                    if (state !== null ) {
                        totalCount = state[i].totalCount;
                    }
                    this.modelArray[i] = {
                        articleAddButtonID: addButtonID, articleCount: 0, articleClearButtonID: clearButtonID, articleAmountElementID: amountFieldID, articleAmount: 0,
                        totalLabelID: totalLabelID, totalPriceFieldID: totalPriceFieldID, totalCountFieldID: totalCountFieldID, totalCount: totalCount, totalAmountFieldID: totalAmountFieldID, totalAmount: 0
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

        let postButtonID = 'postAllButton';
        let clearButtonID = 'clearAllButton';
        let amountFieldID = 'totalAmountField';
        let html1 = '<tr>' +
            '<td><button id="' + postButtonID + '" type="button" class="tildaPostButton" onclick="tilda.postAllButtonClicked()">Buchen</button></td>' +
            '<td><button id="' + clearButtonID + '" type="button" onclick="tilda.clearAllButtonClicked()">0</button></td>' +
            '<td id="' + amountFieldID + '" class="tildaAmountField"></td>';
        '</tr>';
        bonTable.innerHTML += html1;

        // Totals table
        totalsTable.innerHTML = totalsTableHTML;

        let clearTotalsButtonID = 'clearTotalsButton';

        let html2 = '<tr>' +
            '<td><button id="' + clearTotalsButtonID + '" type="button" onclick="tilda.clearTotalsButtonClicked()">Löschen</button></td>' +
            '</tr>';
        totalsTable.innerHTML += html2;

        // Adjust number for fraction digits.
        this.amountFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });

        this.refreshArticlesTable();
    }


    addButtonClicked(index) {
        this.modelArray[index].articleCount++;
        this.refreshArticlesTable();
    }

    clearButtonClicked(index) {
        this.modelArray[index].articleCount = 0;
        this.refreshArticlesTable();
    }

    postAllButtonClicked() {
        document.getElementById("postingsTab").innerHTML += "Buchung " + new Date() + "<br>";
        for (let i = 0; i < this.modelArray.length; i++) {
            this.modelArray[i].totalCount += this.modelArray[i].articleCount;
        }
        localStorage.setItem("modelArray", JSON.stringify(this.modelArray));

        this.clearAllButtonClicked();
    }

    clearAllButtonClicked() {
        for (let i = 0; i < this.modelArray.length; i++) {
            this.modelArray[i].articleCount = 0;
        }
        this.refreshArticlesTable();
    }


    clearTotalsButtonClicked() {
        if (confirm("Wirklich alles Löschen?")) {
            var state = localStorage.removeItem('modelArray');
            this.init();
            this.refreshArticlesTable();
        }
    }
}