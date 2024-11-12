import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly supabaseUrl = 'https://ilhsggimglmzbnkuzgis.supabase.co'; 
  private readonly supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsaHNnZ2ltZ2xtemJua3V6Z2lzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDk0NjAxNCwiZXhwIjoyMDQ2NTIyMDE0fQ.4nRKhTJz2vEjvTgz-AzMZdcLtGbm2kFrzxJJD8fQ3HI';
  private urlFoto = "https://ilhsggimglmzbnkuzgis.supabase.co/storage/v1/object/public/"
  private supabaseClient: SupabaseClient;
  private bucket = "clinica/";

  constructor() {
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
  }

  public async upload(path: string, file: File) {
    const { data, error } = await this.supabaseClient.storage
      .from(this.bucket)
      .upload(path, file);

    return this.urlFoto + this.bucket + path;
  }


}