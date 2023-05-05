import { Create, useAutocomplete } from "@refinedev/mui";
import { Box, TextField, Autocomplete } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { useState } from "react";

interface ICategory {
  id: string;
  name: string;
}


export const IdentifierCreate = () => {
  const [provider, setProvider] = useState('');
  const {
      saveButtonProps,
      refineCore: { formLoading },
      register,
      control,
      formState: { errors },
      watch
  } = useForm();
    const watchProvider = watch("provider");
    console.log(watchProvider)
    const { autocompleteProps } = useAutocomplete<ICategory>({
      resource: "63f82b28924ae0aee756"
    })
    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
            <Autocomplete
              {...register("provider")}
              {...autocompleteProps}
              getOptionLabel={(item) => item.name}
              onChange={(event, value) => value && setProvider(value.name)}
              renderInput={(params) => (
                <TextField
                    {...params}
                    label="Provider"
                    margin="normal"
                    name="provider"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                  )}
            />
                {provider === 'did:web' && <TextField
                    {...register("domain", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.domain}
                    helperText={(errors as any)?.domain?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label="Domain"
                    name="domain"
                />}
                
                <TextField
                    {...register("alias", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.alias}
                    helperText={(errors as any)?.alias?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label="Alias"
                    name="alias"
                />
            </Box>
        </Create>
    );
};
