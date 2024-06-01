function stringToTagsArray(tagsString) {
    // Split the string by commas and trim any extra whitespace from each tag
    return tagsString.split(',').map(tag => tag.trim());
}

module.exports = stringToTagsArray;