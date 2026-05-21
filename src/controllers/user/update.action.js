import { Op } from 'sequelize'
import isUndefined from 'lodash/isUndefined'
import { UserModel } from '../../models'

import translate from '../../helpers/translate'
import AppValidationError from '../../exceptions/AppValidationError'

export const update = async (request, response) => {
    const { params, user: loggedInUser, body } = request

    const id = params?.id ?? loggedInUser?.id

    const updatedBody = {}

    /* if user is updating its own profile */
    let userToBeUpdated = loggedInUser
    let attributeKey = 'Your profile'

    /* if the user is updating someone else's profile */
    if (params?.id && parseInt(params?.id) !== loggedInUser?.id) {
        /* get user to be updated */
        userToBeUpdated = await UserModel.findByPk(id, {
            attributes: ['id', 'roleTitle'],
        })

        if (!userToBeUpdated) {
            /* throw error if the user does not exists */
            throw new AppValidationError(
                translate('errors', 'notFound', {
                    ':attribute': 'User',
                }),
                404
            )
        }

        attributeKey = `${userToBeUpdated?.roleTitle}`
    }

    if (!isUndefined(body?.email)) {
        const existsEmail = await UserModel.findOne({
            where: {
                id: { [Op.ne]: id },
                email: body?.email,
            },
        })

        if (existsEmail) {
            throw new AppValidationError(
                translate('errors', 'account.emailExists')
            )
        } else {
            updatedBody.email = body?.email
        }
    }

    if (!isUndefined(body?.fullName)) {
        updatedBody.fullName = body.fullName
    }
    if (!isUndefined(body?.gender)) {
        updatedBody.gender = body.gender
    }
    if (!isUndefined(body?.dateOfBirth)) {
        updatedBody.dateOfBirth = body.dateOfBirth
    }
    if (!isUndefined(body?.mobileNumber)) {
        const existsMobileNumber = await UserModel.findOne({
            where: {
                id: { [Op.ne]: id },
                mobileNumber: body?.mobileNumber,
            },
        })

        if (existsMobileNumber) {
            throw new AppValidationError(
                translate('errors', 'account.phoneExists')
            )
        } else {
            updatedBody.mobileNumber = body?.mobileNumber
        }
    }
    if (!isUndefined(body?.city)) {
        updatedBody.city = body.city
    }
    if (!isUndefined(body?.height)) {
        updatedBody.height = body.height
    }
    if (!isUndefined(body?.weight)) {
        updatedBody.weight = body.weight
    }
    if (!isUndefined(body?.languages)) {
        updatedBody.languages = body.languages
    }
    if (!isUndefined(body?.tags)) {
        updatedBody.tags = body.tags
    }
    if (!isUndefined(body?.bio)) {
        updatedBody.bio = body.bio
    }
    if (!isUndefined(body?.status)) {
        updatedBody.status = body.status
    }
    if (!isUndefined(body?.profilePhoto)) {
        updatedBody.profilePhoto = body.profilePhoto
    }
    let data = null

    if (updatedBody) {
        data = await UserModel.updateByPk(id, {
            body: updatedBody,
        })
        if (data.city && data.languages && data.bio && data.tags) {
            data = await UserModel.updateByPk(id, {
                body: { isProfileCompleted: 1 },
            })
        }
    }

    /* send response*/
    return response.json({
        data,
        message: translate('messages', 'success', {
            ':attribute': `${attributeKey} has`,
            ':action': 'updated',
        }),
    })
}
