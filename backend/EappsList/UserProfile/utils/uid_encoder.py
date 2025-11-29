import base64

# Encode a user ID into URL-safe Base64 (padding removed)
def encode_uid(pk):
    raw = str(pk).encode()
    encoded = base64.urlsafe_b64encode(raw).decode()
    return encoded.rstrip("=")  # remove padding safely

# Decode a URL-safe Base64 UID with automatic padding restoration
def decode_uid(uidb64):
    padding = '=' * (-len(uidb64) % 4)  # restore missing padding
    uidb64 += padding
    return int(base64.urlsafe_b64decode(uidb64).decode())
