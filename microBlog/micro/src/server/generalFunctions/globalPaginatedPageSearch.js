const LOGGER = require('../logger/logger.util')
const { trimStrings } = require('../generalFunctions/stringManipulations');
const { arrayPaginationFunction } = require('../generalFunctions/paginationOfArrays')
const pageSchema = require('../models/page')
const { pageStatus } = require('../statusCatalogue/pageStatus')


async function globalpaginatedPageSearchFunction(req, res) {
    LOGGER.info('globalpaginatedPageSearchFunction')
    try {
        const search = trimStrings(req.query.search) || ""
        const limit = parseInt(10)
        const skip = parseInt(req.query.skip) || 0;
        let pageResult
        let skipPageResult
        let finalPageResult
        let pageCount
        let pageReturns


        pageResult = await pageSearchQuery(search)
        pageCount = pageResult.length
        skipPageResult = pageResult.slice(skip)
        finalPageResult = arrayPaginationFunction(limit, skipPageResult)
        pageReturns = pageResultReturns(pageCount, skip, limit, finalPageResult, res)
        return pageReturns
    } catch (error) {
        LOGGER.error('globalpaginatedPageSearchFunction', error)
    }
}

function pageResultReturns(count, skip, limit, finalPageResult, res) {
    LOGGER.info('pageResultReturns')
    try {
        if ((count - skip) > limit) {
            const next = parseInt(skip + limit)
            return res.status(200).send({ message: "sucess", count: count, 'skip': next, pages: finalPageResult })

        } else {
            return res.status(200).send({ message: "sucess", count: count, pages: finalPageResult })

        }
    } catch (error) {
        LOGGER.error('pageResultReturns', error)
    }
}

async function pageSearchQuery(search, balanceFromTen) {
    LOGGER.info('pageSearchQuery')
    try {
        let pageResult

        if (balanceFromTen == 0 || balanceFromTen == null) {
            pageResult = await pageSchema
                .find({ page_name: { $regex: search, $options: 'i' }, status: pageStatus.ACTIVE })
            return pageResult
        }
        pageResult = await pageSchema
            .find({ page_name: { $regex: search, $options: 'i' }, status: pageStatus.ACTIVE })
            .limit(balanceFromTen)
        return pageResult
    } catch (error) {
        LOGGER.error('pageSearchQuery', error)
    }
}

module.exports = {
    globalpaginatedPageSearchFunction,
    pageSearchQuery
}