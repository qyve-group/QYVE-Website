const { data, error } = await supabaseAdmin.from('refunds').insert([
  {
    order_id: selectedOrderId,
    user_id: userId,
    amount: totalPrice[idx] + 5,
    reason: 'Product damaged on arrival',
    status: 'pending',
  },
]);

if (error) console.error('Error creating refund request:', error);
else console.log('Refund request created:', data);
