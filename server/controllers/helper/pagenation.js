const paginatedResults = (length,queryPage)=> {
        let page = 1;
        const limit = 10;
        console.log("hi")
        const results = {}

        if(queryPage) page = parseInt(queryPage);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit

        if (endIndex < length) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            if(startIndex>length)
                results.previous = {
                    page: Math.ceil(length/limit),
                    limit: limit
                }
            else
                results.previous = {
                    page: page - 1,
                    limit: limit
                }
        }
        try {
            results.indexes = {
                startIndex:startIndex,
                endIndex: endIndex
            }
            return results;
        } catch (e) {
            console.log(e.message);
            return e;
        }
};

module.exports = {
    paginatedResults: paginatedResults,

}