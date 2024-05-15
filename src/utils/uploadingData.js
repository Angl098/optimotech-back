const axios = require('axios');
// const { suplementData } = require('../helpers/suplementData');
const { Suplement } = require('../db');
const data = require('../../../data')
const fs = require('fs');

const uploadingData = async () => {
    try {
        const rawSuplementsData = fs.readFileSync('../../../data.js');
        const suplements = JSON.parse(rawSuplementsData);

        const suplementData = function (array) {
            return array.map((suplement) => {
                return {
                    id: suplement.id,
                    name: suplement.name,
                    category: suplement.category,
                    price: suplement.price,
                    image: suplement.image,
                    amount: suplement.amount,
                }
            })
        }
        const suplementCleaner = suplementData(suplements);
        return await suplementCleaner.forEach(suplement => { Suplement.create(suplement); });
    } catch (error) {
        console.error(error);
    }
};

module.exports = uploadingData;