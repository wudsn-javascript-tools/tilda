// Whole-script strict mode syntax
"use strict";


class Data {

    // 
    constructor() {

        this.categories = [
            { id: "c1", text: "Kaffee", style: "background-color:#e4b7f7;" },
            { id: "c2", text: "Alkoholisches", style: "background-color:#f7b7bb;" },
            { id: "c3", text: "Wein", style: "background-color:#adf7b3;" },
            { id: "c4", text: "Alkoholfrei", style: "background-color:#f7efad;" },
            { id: "c5", text: "Pfand", style: "background-color:#fdfdfd; color:#ff2738; font-weight:bold;" }
        ];
        this.entries = [
            { category: "c1" },
            { text: "Kaffee", price: 3.00 },
            { text: "Espresso", price: 3.00 },
            { text: "Cappuccino/Latte", price: 4.00 },
            { text: "Espresso Doppelt", price: 4.00 },
            { text: "Cappuccino Baileys", price: 7.00 },
            { text: "Espresso Macchiato", price: 3.00 },
            { text: "Moccaccino", price: 4.00 },
            { text: "Kukuma Latte", price: 4.00 },
            { text: "Kakao", price: 3.00 },
            { text: "Chai Latte", price: 4.00 },
            { category: "c2" },
            { text: "Crémant/Prosecco", price: 5.00 },
            { text: "Gin Pink Lady", price: 7.00 },
            { text: "Lavendel Crémant", price: 6.00 },
            { text: "Gin Tonic", price: 7.00 },
            { text: "Aperol Spritz", price: 7.00 },
            { text: "Gin Tonic Mare", price: 10.00 },
            { text: "Hugo", price: 7.00 },
            { text: "Gin küsst Kaffee", price: 10.00 },
            { text: "Lillet Spritz", price: 7.00 },
            { text: "Rocco Gin", price: 10.00 },
            { text: "Limoncello Spritz", price: 7.00 },
            { text: "Special", price: 7.00 },

            { category: "c3" },
            { text: "Wein Weiß (0,2l)", price: 6.00 },
            { text: "Wein Weiß (Flasche)", price: 18.00 },
            { text: "Wein Rosé (0,2l)", price: 6.00 },
            { text: "Wein Rosé (Flasche)", price: 18.00 },
            { text: "Wein Rot (0,1l)", price: 6.00 },
            { text: "Wein Rot (Flasche)", price: 39.00 },

            { category: "c4" },
            { text: "Martini Floreale", price: 7.00 },
            { text: "Limo", price: 3.00 },
            { text: "Sprudel (0,2l)", price: 2.00 },
            { text: "Sprudel (Flasche)", price: 4.00 },

            { category: "c5" },
            { text: "Pfand", price: 4.00 },
            { text: "Pfand zurück", price: -4.00 }
        ];
    }

}