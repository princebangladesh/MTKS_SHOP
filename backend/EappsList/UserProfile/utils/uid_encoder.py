import base64

def encode_uid(pk):
    raw = str(pk).encode()
    encoded = base64.urlsafe_b64encode(raw).decode()
    return encoded.rstrip("=")  


def decode_uid(uidb64):
    padding = '=' * (-len(uidb64) % 4)  
    uidb64 += padding
    return int(base64.urlsafe_b64decode(uidb64).decode())
