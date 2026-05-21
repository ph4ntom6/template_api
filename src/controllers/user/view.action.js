import { UserModel } from '../../models'

import translate from '../../helpers/translate'

import AppValidationError from '../../exceptions/AppValidationError'

export const view = async (request, response) => {
    const {
        params: { id },
        user,
    } = request

    if (
        user?.roleTitle === 'Admin' &&
        user?.roleTitle === 'Business' &&
        user?.roleTitle === 'User' &&
        id
    ) {
        return response.status(403).send('Forbidden')
    }

    const where = {
        id: id || user?.id,
    }

    const attributes = [
        'id',
        'roleId',
        'roleTitle',
        'fullName',
        'profilePhoto',
        'email',
        'mobileNumber',
        'gender',
        'dateOfBirth',
        'city',
        'height',
        'weight',
        'languages',
        'tags',
        'bio',
        'noOfVideos',
        'status',
        'isProfileCompleted',
        'isMobileNumberVerified',
        'createdAt',
    ]

    const data = await UserModel.findOne({
        where,
        attributes,
    })

    /* return error if user is not found */
    if (!data) {
        throw new AppValidationError(
            translate('validations', 'notFound', {
                ':attribute': 'user',
            })
        )
    }

    /* send response */
    return response.json({
        data,
    })
}
