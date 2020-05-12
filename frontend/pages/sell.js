import {useForm} from 'react-hook-form'
import {useMutation} from '@apollo/react-hooks'

import StyledForm from '#root/components/styles/StyledForm'

import CREATE_ITEM_MUTATION from '#root/graphql/createItem.mutation'

export const fileUpload = async files => {
  const body = new FormData()
  body.append('file', files[0])
  body.append('upload_preset', process.env.CLOUDINARY_PRESET)

  const res = await fetch(process.env.CLOUDINARY_URL, {method: 'POST', body})

  const file = await res.json()

  return file
}

const Sell = () => {
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const [createItem, {data, loading, error}] = useMutation(CREATE_ITEM_MUTATION)

  const {register, handleSubmit, errors, watch, reset} = useForm()

  const onSubmit = async ({image, ...other}) => {
    try {
      setUploadingImage(true)

      const {secure_url} = await fileUpload(image)

      const price = (other.price * 100).toFixed() * 1

      await createItem({
        variables: {
          ...other,
          imageUrl: secure_url,
          price,
        },
      })

      reset()
    } catch (err) {}

    setUploadingImage(false)
  }

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        disabled={loading || uploadingImage}
        aria-busy={loading || uploadingImage}
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
            ref={register({
              required: 'You must specify an image',
            })}
          />
          {errors.image && <p>{errors.image.message}</p>}
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

        {error?.message && <p className="error">{error.message}</p>}

        {data && <p className="success">Item created successfully</p>}

        <button data-testid="submit" type="submit">
          Create Item
        </button>
      </fieldset>
    </StyledForm>
  )
}

export default Sell
