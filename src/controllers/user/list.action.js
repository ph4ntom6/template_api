import { Op } from 'sequelize'
// import { isUndefined } from 'lodash'
import { UserModel } from '../../models'

export const get = async (request, response) => {
    const { query, user } = request

    let where = {}

    request.query.orderBy = query?.orderBy || 'createdAt'

    if (query?.roleTitle && query?.roleTitle !== '') {
        where.roleTitle = query?.roleTitle
    }

    /* filter by status */
    if (query?.status && query?.status !== '') where.status = query?.status

    /* filter by gender */
    if (query?.gender && query?.gender !== '') where.gender = query?.gender

    /* search by keyword */
    if (query?.keyword && query?.keyword !== '') {
        where = {
            ...where,
            [Op.or]: [
                {
                    fullName: {
                        [Op.like]: `%${query.keyword}%`,
                    },
                },
                {
                    city: {
                        [Op.like]: `%${query.keyword}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${query.keyword}%`,
                    },
                },
                {
                    mobileNumber: {
                        [Op.like]: `%${query.keyword}%`,
                    },
                },
                {
                    languages: {
                        [Op.like]: [].concat(`%${query.keyword}%`),
                    },
                },
                {
                    tags: {
                        [Op.like]: [].concat(`%${query.keyword}%`),
                    },
                },
            ],
        }
    }

    const excludedAttribute = ['verificationCode']

    if (user?.roleTitle === 'Business') {
        excludedAttribute.push('mobileNumber')
        excludedAttribute.push('email')
    }

    const data = await UserModel.paginate(
        request,
        {
            where,
        },
        excludedAttribute
    )

    response.json({
        data,
    })
}
