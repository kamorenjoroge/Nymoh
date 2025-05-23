// app/api/products/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '../../../lib/cloudinary';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Products';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    
    // Extract text fields
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string) || 1;
    const details = formData.get('details') as string;
    const color = formData.get('color') as string;
    
    // Process images with Cloudinary
    const imageFiles = formData.getAll('images') as File[];
    const imageUrls: string[] = [];
    
    for (const file of imageFiles) {
      const buffer = await file.arrayBuffer();
      const array = new Uint8Array(buffer);
      
      const result = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'products' }, // Customize folder as needed
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result!.secure_url);
          }
        ).end(array);
      });
      
      imageUrls.push(result);
    }
    
    // Create new product with Cloudinary URLs
    const product = await Product.create({
      name,
      price,
      quantity,
      details,
      color,
      images: imageUrls
    });
    
    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
    
  } catch (error: unknown) {
    console.error('Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}