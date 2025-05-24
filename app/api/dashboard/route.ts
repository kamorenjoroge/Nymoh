import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Products from '../../../models/Products';
import { Order } from '../../../models/Orders';

export async function GET() {
  try {
    await dbConnect();

    const totalProducts = await Products.countDocuments();

    // Only count orders not pending or cancelled
    const validOrdersFilter = {
      status: { $nin: ['pending', 'cancelled'] }
    };

    const totalOrders = await Order.countDocuments(validOrdersFilter);

    const totalRevenueAgg = await Order.aggregate([
      { $match: validOrdersFilter },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Count unique customerEmail from valid orders
    const activeUsersAgg = await Order.aggregate([
      { $match: validOrdersFilter },
      { $group: { _id: "$customerEmail" } },
      { $count: "activeUsers" }
    ]);
    const activeUsers = activeUsersAgg[0]?.activeUsers || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        activeUsers
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}


