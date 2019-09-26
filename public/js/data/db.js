
import cardColors from './cardColors';
import chineseColors from './chineseColors';
import gradients from './gradients';
import pantone from './pantone';
import pantoneGuides from './pantoneGuides';

let cc = {
    cardColors: cardColors,
    chineseColors: chineseColors,
    pantoneGuides: pantoneGuides,
    pantone: pantone,
    gradients: gradients,
    cloudDB: wx.cloud.database()
};


module.exports = cc;