import {useForm} from 'react-hook-form'
import {useQuery, useMutation} from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import StyledForm from '#root/components/styles/StyledForm'
import ITEM_QUERY from '#root/graphql/item.query'
import UPDATE_ITEM_MUTATION from '#root/graphql/updateItem.mutation'

const Update = ({query}) => {
  const [uploadingImage, setUploadingImage] = React.useState(false)

  const {data, loading, error} = useQuery(ITEM_QUERY, {
    variables: {id: query.id},
    onCompleted: ({item}) => reset(item),
  })

  const [updateItem, {data: updatedData, loading: updateLoading}] = useMutation(
    UPDATE_ITEM_MUTATION,
  )

  const {register, handleSubmit, errors, reset} = useForm()

  const fileUpload = async image => {
    if (!image) return null

    setUploadingImage(true)

    const body = new FormData()
    body.append('file', image)
    body.append('upload_preset', process.env.CLOUDINARY_PRESET)

    const res = await fetch(process.env.CLOUDINARY_URL, {method: 'POST', body})

    const file = await res.json()

    setUploadingImage(false)

    return file
  }

  const onSubmit = async ({image, ...other}) => {
    try {
      const upload = await fileUpload(image[0])

      const price = (other.price * 100).toFixed() * 1

      const {data} = await updateItem({
        variables: {
          id: query.id,
          ...other,
          price,
          ...(upload?.secure_url && {imageUrl: upload.secure_url}),
        },
      })

      reset(data.updateItem)
    } catch (err) {}
  }

  if (loading) return <div>Loading item...</div>
  if (error) return <div>Failed to load item...</div>

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        disabled={uploadingImage || updateLoading}
        aria-busy={uploadingImage || updateLoading}
      >
        <label>
          Title
          <input
            type="text"
            placeholder="Title"
            name="title"
            data-testid="title"
            ref={register({
              required: 'You must specify a title',
            })}
            autoFocus
          />
          {errors.title && <p>{errors.title.message}</p>}
        </label>

        <label>
          Image
          <input
            type="file"
            placeholder="Upload image"
            name="image"
            data-testid="image"
            ref={register}
          />
          <img
            data-testid="image-preview"
            src={data?.item.imageUrl}
            alt="product"
          />
        </label>

        <label>
          Description
          <textarea
            type="text"
            placeholder="Description"
            name="description"
            data-testid="description"
            ref={register({
              required: 'You must specify a description',
            })}
          />
          {errors.description && <p>{errors.description.message}</p>}
        </label>

        <label>
          Price
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="£"
            name="price"
            data-testid="price"
            ref={register({
              required: 'You must specify a price',
            })}
          />
          {errors.price && <p>{errors.price.message}</p>}
        </label>

        {updatedData && <p className="success">Item updated successfully</p>}

        <button data-testid="submit" type="submit">
          Update Item
        </button>
      </fieldset>
    </StyledForm>
  )
}

Update.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
}

export default Update
