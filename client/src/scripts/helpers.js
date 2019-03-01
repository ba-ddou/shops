
/*
*
*
* helper functions
*
*
*
*/

const helpers = {};


helpers.elementInViewport =  (elem) => {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};


export default helpers;