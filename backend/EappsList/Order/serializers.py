from rest_framework import serializers
from .models import Order, OrderItem
from ..Product.models import Product, ProductVariant, Colour
from decimal import Decimal


# ---------------------------------------------------------
# Order Item Input
# ---------------------------------------------------------
class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=False)
    variant_id = serializers.IntegerField(required=False)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate(self, attrs):
        if not attrs.get("variant_id") and not attrs.get("product_id"):
            raise serializers.ValidationError(
                "Either variant_id or product_id is required."
            )
        if attrs.get("quantity") <= 0:
            raise serializers.ValidationError(
                {"quantity": "Quantity must be greater than zero."}
            )
        return attrs


# ---------------------------------------------------------
# Main Order Serializer  (FIXED WITH status_display)
# ---------------------------------------------------------
class OrderSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = "__all__"

    def get_items(self, obj):
        request = self.context.get("request")
        output = []

        for item in obj.items.all():
            variant = item.product_variant
            product = variant.product

            # ------------------------------
            # IMAGE PRIORITY
            # ------------------------------
            if variant.image:
                image = variant.image.url
            elif product.image1:
                image = product.image1.url
            elif product.image2:
                image = product.image2.url
            elif product.image3:
                image = product.image3.url
            elif product.image4:
                image = product.image4.url
            else:
                image = "/media/default/no-image.png"

            # Convert to full absolute URL
            if request:
                image = request.build_absolute_uri(image)

            output.append({
                "product": product.name,
                "variant_id": variant.id,
                "quantity": item.quantity,
                "price": float(item.price),
                "image": image,        # ⭐ FIXED — this is what frontend needs
            })

        return output


# ---------------------------------------------------------
# Order Create Serializer
# ---------------------------------------------------------
class OrderCreateSerializer(serializers.Serializer):
    shipping_address = serializers.CharField()
    billing_address = serializers.CharField()
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    items = OrderItemInputSerializer(many=True)

    def get_default_color(self):
        color, _ = Colour.objects.get_or_create(
            colour_name="Default",
            defaults={"colour_code": "#FFFFFF"}
        )
        return color

    def create(self, validated_data):
        user = self.context["request"].user
        items = validated_data.pop("items")

        # Recalculate total on backend
        calculated_total = sum(
            Decimal(item["price"]) * item["quantity"] for item in items
        )

        if calculated_total != validated_data["total_price"]:
            raise serializers.ValidationError(
                {"total_price": "Total price mismatch — possible tampering detected."}
            )

        # Create Order
        order = Order.objects.create(user=user, **validated_data)
        default_color = self.get_default_color()

        # Process Order Items
        for item in items:

            # CASE 1 — Product With Variant
            if item.get("variant_id"):
                try:
                    variant = ProductVariant.objects.get(id=item["variant_id"])
                except ProductVariant.DoesNotExist:
                    raise serializers.ValidationError({"variant_id": "Invalid variant ID"})

                if item.get("product_id") and variant.product_id != item["product_id"]:
                    raise serializers.ValidationError(
                        {"variant_id": "Variant does not belong to the supplied product_id"}
                    )

            # CASE 2 — Simple Product (no variant)
            else:
                try:
                    product = Product.objects.get(id=item["product_id"])
                except Product.DoesNotExist:
                    raise serializers.ValidationError({"product_id": "Invalid product ID"})

                variant, _ = ProductVariant.objects.get_or_create(
                    product=product,
                    color=default_color,
                    size=None,
                    defaults={
                        "quantity": product.quantity,
                        "current_price": product.current_price,
                        "previous_price": product.previous_price,
                    }
                )

            # STOCK CHECK
            if variant.quantity < item["quantity"]:
                raise serializers.ValidationError({
                    "quantity": f"Only {variant.quantity} items available for variant {variant.id}"
                })

            # Create the Order Item
            OrderItem.objects.create(
                order=order,
                product_variant=variant,
                quantity=item["quantity"],
                price=item["price"],
            )

        return order
