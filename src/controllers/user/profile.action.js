import { Op } from 'sequelize'

import dayjs from '../../helpers/dayjs'

import { EntryModel, UserModel, ContestModel } from '../../models'

export const profile = async (request, response) => {
    const { query, user: loggedInUser } = request

    const where = { userId: loggedInUser?.id }
    let userWhere = {}

    /* filter by status */
    if (query?.status && query?.status !== '') where.status = query?.status

    if (query?.isSelected && query?.isSelected !== '')
        where.isSelected = query?.isSelected

    if (query?.isShortlisted && query?.isShortlisted !== '')
        where.isShortlisted = query?.isShortlisted

    if (query?.keyword && query?.keyword !== '') {
        userWhere = {
            ...userWhere,
            [Op.or]: [
                {
                    fullName: {
                        [Op.like]: `%${query.keyword}%`,
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

    if (query?.language && query?.language !== '') {
        userWhere = {
            ...userWhere,
            [Op.and]: [
                {
                    languages: {
                        [Op.like]: [].concat(`%${query.language}%`),
                    },
                },
            ],
        }
    }

    if (query?.gender && query?.gender !== '') userWhere.gender = query?.gender

    if (query?.city && query?.city !== '') userWhere.city = query?.city

    // Height Check
    let minHeight = 0
    let maxHeight = 1000
    if (query?.minHeight && query?.minHeight !== '') {
        minHeight = query?.minHeight
    }
    if (query?.maxHeight && query?.maxHeight !== '') {
        maxHeight = query?.maxHeight
    }
    if (
        (query?.minHeight && query?.minHeight !== '') ||
        (query?.maxHeight && query?.maxHeight !== '')
    ) {
        userWhere = {
            ...userWhere,
            [Op.and]: [
                {
                    height: {
                        [Op.between]: [minHeight, maxHeight],
                    },
                },
            ],
        }
    }

    // Weight Check
    let minWeight = 0
    let maxWeight = 1000
    if (query?.minWeight && query?.minWeight !== '') {
        minWeight = query?.minWeight
    }
    if (query?.maxWeight && query?.maxWeight !== '') {
        maxWeight = query?.maxWeight
    }
    if (
        (query?.minWeight && query?.minWeight !== '') ||
        (query?.maxWeight && query?.maxWeight !== '')
    ) {
        userWhere = {
            ...userWhere,
            [Op.and]: [
                {
                    weight: {
                        [Op.between]: [minWeight, maxWeight],
                    },
                },
            ],
        }
    }

    // Age Check
    let minAge = 0
    let maxAge = 100
    if (query?.minAge && query?.minAge !== '') {
        minAge = query?.minAge
    }
    if (query?.maxAge && query?.maxAge !== '') {
        maxAge = query?.maxAge
    }
    if (
        (query?.minAge && query?.minAge !== '') ||
        (query?.maxAge && query?.maxAge !== '')
    ) {
        userWhere = {
            ...userWhere,
            [Op.and]: [
                {
                    dateOfBirth: {
                        [Op.between]: [
                            dayjs()
                                .subtract(maxAge, 'year')
                                .format('YYYY-MM-DD'),
                            dayjs()
                                .subtract(minAge, 'year')
                                .format('YYYY-MM-DD'),
                        ],
                    },
                },
            ],
        }
    }

    request.query.orderBy = query?.orderBy || 'createdAt'

    const attributes = [
        'id',
        'userId',
        'businessId',
        'contestId',
        'caption',
        'video',
        'status',
        'createdAt',
        'isSelected',
        'isShortlisted',
    ]

    const data = await EntryModel.paginate(request, {
        where,
        attributes,
        include: [
            {
                model: UserModel,
                as: 'user',
                required: true,
                attributes: [
                    'id',
                    'fullName',
                    'gender',
                    'dateOfBirth',
                    'profilePhoto',
                    'languages',
                    'city',
                    'height',
                    'weight',
                    'tags',
                    'bio',
                    'noOfVideos',
                ],
                where: userWhere,
            },
            {
                model: ContestModel,
                as: 'contest',
                required: false,
                attributes: [
                    'id',
                    'businessTitle',
                    'businessProfilePhoto',
                    'title',
                    'subTitle',
                    'gender',
                    'city',
                    'challenge',
                    'status',
                ],
            },
        ],
    })

    return response.json({
        data: data,
    })
}
