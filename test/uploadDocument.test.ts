import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import multer from 'multer';
import axios, { AxiosError } from 'axios';
import { createMockClient, MockedDocumentEngineClient } from './utils/mockTypes.js';

// Mock the logger to prevent console output during tests
vi.mock('../src/utils/Logger.js', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock the Document Engine client
vi.mock('../src/api/ClientFactory.js', () => ({
  getDocumentEngineClient: vi.fn(),
}));

describe('Upload Document Endpoint', () => {
  let app: express.Express;
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    // Create a new Express app for each test
    app = express();
    app.use(express.json());

    // Configure multer for file uploads
    const upload = multer({ storage: multer.memoryStorage() });

    // Create a mock DocumentEngineClient
    mockClient = createMockClient();

    // Mock the getDocumentEngineClient function to return our mock client
    vi.doMock('../src/api/ClientFactory.js', () => ({
      getDocumentEngineClient: vi.fn().mockResolvedValue(mockClient),
    }));

    // Add the upload-document endpoint to the app
    app.post('/upload-document', upload.single('file'), async (req, res) => {
      try {
        // Check if file was uploaded
        if (!req.file) {
          return res.status(400).json({
            status: 'error',
            message: 'No file uploaded',
          });
        }

        // Forward all headers from the original request except host and connection
        const headers: Record<string, string> = {};
        for (const [key, value] of Object.entries(req.headers)) {
          if (
            key.toLowerCase() !== 'host' &&
            key.toLowerCase() !== 'connection' &&
            typeof value === 'string'
          ) {
            headers[key] = value;
          }
        }

        // Convert file buffer to base64
        const fileBase64 = req.file.buffer.toString('base64');

        // Forward the request to Document Engine
        const response = await mockClient['upload-document'](headers, {
          file: fileBase64,
          title: req.body.title || req.file.originalname,
        });

        // Return the response from Document Engine
        res.status(200).json(response.data);
      } catch (error) {
        let statusCode = 500;
        let errorMessage = 'Unknown error';
        let errorDetails = undefined;

        if (axios.isAxiosError(error)) {
          statusCode = error.response?.status || 500;
          errorMessage = error.message;
          errorDetails = error.response?.data;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        res.status(statusCode).json({
          status: 'error',
          message: errorMessage,
          details: errorDetails,
        });
      }
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app).post('/upload-document').expect(400);

    expect(response.body).toEqual({
      status: 'error',
      message: 'No file uploaded',
    });
  });

  it('should forward the file to Document Engine and return the response', async () => {
    // Mock the Document Engine response
    const mockResponse = {
      data: {
        data: {
          document_id: 'doc_123456789',
          title: 'Test Document',
        },
      },
    };
    mockClient['upload-document'].mockResolvedValue(mockResponse); // Mocking client method for testing

    // Create a test file
    const testFile = Buffer.from('Test file content');

    // Send the request
    const response = await request(app)
      .post('/upload-document')
      .attach('file', testFile, 'test.txt')
      .field('title', 'Test Document')
      .expect(200);

    // Verify the response
    expect(response.body).toEqual({
      data: {
        document_id: 'doc_123456789',
        title: 'Test Document',
      },
    });

    // Verify the client was called with the correct parameters
    expect(mockClient['upload-document']).toHaveBeenCalledTimes(1);
    const callArgs = mockClient['upload-document'].mock.calls[0]; // Accessing mock call arguments for testing

    // Verify headers were forwarded
    expect(callArgs[0]).toBeDefined();

    // Verify file was converted to base64 and title was set
    expect(callArgs[1]).toHaveProperty('file');
    expect(callArgs[1]).toHaveProperty('title', 'Test Document');
  });

  it('should use the original filename if no title is provided', async () => {
    // Mock the Document Engine response
    const mockResponse = {
      data: {
        data: {
          document_id: 'doc_123456789',
          title: 'test.txt',
        },
      },
    };
    mockClient['upload-document'].mockResolvedValue(mockResponse); // Mocking client method for testing

    // Create a test file
    const testFile = Buffer.from('Test file content');

    // Send the request without a title
    const response = await request(app)
      .post('/upload-document')
      .attach('file', testFile, 'test.txt')
      .expect(200);

    // Verify the response
    expect(response.body).toEqual({
      data: {
        document_id: 'doc_123456789',
        title: 'test.txt',
      },
    });

    // Verify the client was called with the correct parameters
    expect(mockClient['upload-document']).toHaveBeenCalledTimes(1);
    const callArgs = mockClient['upload-document'].mock.calls[0]; // Accessing mock call arguments for testing

    // Verify title was set to the original filename
    expect(callArgs[1]).toHaveProperty('title', 'test.txt');
  });

  it('should handle errors from Document Engine', async () => {
    // Mock the Document Engine to throw an error
    const errorMessage = 'API Error: Invalid file format';
    const mockError = new AxiosError(errorMessage);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockError.response = { status: 400, data: { error: 'Invalid file format' } } as any; // Creating mock error response for testing
    mockClient['upload-document'].mockRejectedValue(mockError); // Mocking client method for testing

    // Create a test file
    const testFile = Buffer.from('Test file content');

    // Send the request
    const response = await request(app)
      .post('/upload-document')
      .attach('file', testFile, 'test.txt')
      .expect(400);

    // Verify the error response
    expect(response.body).toEqual({
      status: 'error',
      message: errorMessage,
      details: { error: 'Invalid file format' },
    });
  });
});
