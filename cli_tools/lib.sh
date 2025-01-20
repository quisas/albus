# create a token quote function to clean up user 
# inputs and make sure they have quotes
function token_quotes {
  local quoted=()
  for token; do
    quoted+=( "$(printf '%q' "$token")" )
  done
  printf '%s\n' "${quoted[*]}"
}

# # Welcome the user accordingly
# output=(echo "Welcome user:" "$name")
# # don't blindly echo, rather run it through the tokenizer
# eval "$(token_quotes "${output[@]}")"
